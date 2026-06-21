import {
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { ZebarContext } from "../../contexts";
import { SpTrayIcon } from "./SpTrayIcon";
import type { SystrayIcon } from "zebar";
import { SpStretchBox } from "../SpStretchBox";
import { SpButton } from "../SpButton/SpButton";
import SpTooltip from "../SpTooltip";
import "./SpSystemTray.css";

export interface SpSystemTrayProps {
  iconLimit?: number;
  sortComparator?: (a: SystrayIcon, b: SystrayIcon) => number;
  expandDirection?: "start" | "end";
  expandFloating?: boolean;
}
export const SpSystemTray = ({
  iconLimit,
  sortComparator,
  expandDirection,
  expandFloating,
}: SpSystemTrayProps) => {
  expandDirection ??= "start";
  expandFloating ??= false;
  const zebar = useContext(ZebarContext);
  const [expanded, setExpanded] = useState(false);
  const [sortedIcons, setSortedIcons] = useState<SystrayIcon[]>([]);
  const availableIcons = zebar?.systray?.icons;
  if (iconLimit && iconLimit >= (availableIcons?.length ?? 0)) {
    iconLimit = undefined;
  }

  const iconsToShow = !iconLimit || expanded ? undefined : iconLimit;

  useEffect(() => {
    if ((availableIcons?.length ?? 0) === 0 && sortedIcons.length === 0) {
      return;
    }
    setSortedIcons(
      (sortComparator
        ? availableIcons?.sort(sortComparator)
        : availableIcons) ?? [],
    );
  }, [expanded, availableIcons, iconsToShow]);

  const primaryIcons = sortedIcons.slice(0, iconLimit);
  const secondaryIcons = iconLimit ? sortedIcons.slice(iconLimit) : [];

  const expanderLabel = expanded ? "Collapse tray" : "Expand tray";

  const onExpanderClick = () => {
    setExpanded(!expanded);
  };

  const onBlur = () => {
    setExpanded(false);
  };

  const onEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setExpanded(false);
    }
  };

  const style: CSSProperties = {
    "--primary-icon-count": (
      1 + Math.min(iconLimit ?? 0, sortedIcons.length)
    ).toFixed(0),
    "--secondary-icon-count": secondaryIcons.length,
  } as CSSProperties;

  // TODO: USE ARIA ACTIVE DESCENDANT TO MANAGE SELECTION WITHOUT INCURRING BLUR PENALTIES

  return (
    <div
      className={`system-tray system-tray--expand-${expandDirection} ${expanded ? "system-tray--expanded" : ""} ${expandFloating ? "system-tray--expand-floating" : ""}`}
      style={style}
      onKeyDown={onEscape}
    >
      <SpStretchBox
        className="system-tray__exterior"
        aria-role="toolbar"
        aria-label="System Tray"
        path="ui/top_bar/top_bar_char_backdrop"
        width={90}
        height={85}
        inset={30}
      >
        <div className="system-tray__interior" onBlurCapture={onBlur}>
          <SpTooltip
            anchor={(id) => (
              <SpButton
                className="tray-icon system-tray__expander"
                aria-label={expanderLabel}
                aria-describedby={id}
                onClick={onExpanderClick}
              >
                ⋯
              </SpButton>
            )}
            desc={expanderLabel}
          />
          {primaryIcons.map((data) => (
            <SpTrayIcon key={data.id} {...data} />
          ))}
          <div className="system-tray__secondary-icons">
            {secondaryIcons.map((data) => (
              <SpTrayIcon key={data.id} {...data} />
            ))}
          </div>
        </div>
      </SpStretchBox>
    </div>
  );
};
