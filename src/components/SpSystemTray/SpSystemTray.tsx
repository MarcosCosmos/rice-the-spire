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
    const result =
      (sortComparator
        ? availableIcons?.toSorted(sortComparator)
        : availableIcons) ?? [];
    if (expandDirection === "start") {
      result.toReversed();
    }
    setSortedIcons(result);
  }, [expanded, availableIcons, iconsToShow]);

  const [primaryIcons, secondaryIcons] =
    expandDirection === "end"
      ? [
          sortedIcons.slice(0, iconLimit),
          iconLimit ? sortedIcons.slice(iconLimit) : [],
        ]
      : [
          sortedIcons.slice(iconLimit ? -iconLimit : 0),
          iconLimit ? sortedIcons.slice(0, -iconLimit) : [],
        ];

  if (expandDirection == "start") {
    primaryIcons.reverse();
  }
  secondaryIcons.reverse();

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

  const expander = (
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
  );

  const style: CSSProperties = {
    "--primary-icon-count": 1 + Math.min(iconLimit ?? 0, sortedIcons.length),
    "--secondary-icon-count": secondaryIcons.length,
  } as CSSProperties;

  // TODO: USE ARIA ACTIVE DESCENDANT TO MANAGE SELECTION WITHOUT INCURRING BLUR PENALTIES

  // todo: fix visibility issue (maybe by also using height and overflow y: hidden?)

  return (
    <div
      className={`system-tray system-tray--expand-${expandDirection} ${expanded ? "system-tray--expanded" : ""} ${expandFloating ? "system-tray--expand-floating" : ""}`}
      style={style}
      role="toolbar"
      aria-label="System Tray"
      onKeyDown={onEscape}
    >
      <SpStretchBox
        className="system-tray__exterior"
        path="ui/top_bar/top_bar_char_backdrop"
        width={90}
        height={85}
        inset={30}
      >
        <div className="system-tray__interior" onBlurCapture={onBlur}>
          {expandDirection === "end" ? (
            <>
              {expander}
              {primaryIcons.map((data) => (
                <SpTrayIcon key={data.id} {...data} />
              ))}
              <div className="system-tray__secondary-icons">
                {secondaryIcons.map((data) => (
                  <SpTrayIcon key={data.id} {...data} disabled={!expanded} />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="system-tray__secondary-icons">
                {secondaryIcons.map((data) => (
                  <SpTrayIcon key={data.id} {...data} disabled={!expanded} />
                ))}
              </div>
              {primaryIcons.map((data) => (
                <SpTrayIcon key={data.id} {...data} />
              ))}
              {expander}
            </>
          )}
        </div>
      </SpStretchBox>
    </div>
  );
};
