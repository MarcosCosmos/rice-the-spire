import { useContext, useEffect, useState } from "react";
import SpRegion from "../SpRegion";
import "./SpSystemTray.css";
import { ZebarContext } from "../../contexts";
import { SpTrayIcon } from "./SpTrayIcon";
import SpMenuItem from "../SpMenuItem";
import type { SystrayIcon } from "zebar";
import { SpStretchBox } from "../SpStretchBox";
import { resolveSpireImage } from "../../util";

export interface SpSystemTrayProps {
  iconLimit?: number;
  sortComparator?: (a: SystrayIcon, b: SystrayIcon) => number;
  expandAnchor?: "start" | "end";
}
export const SpSystemTray = ({
  iconLimit,
  sortComparator,
  expandAnchor,
}: SpSystemTrayProps) => {
  expandAnchor ??= "start";
  const zebar = useContext(ZebarContext);
  const [expanded, setExpanded] = useState(false);
  const [shownIcons, setShownIcons] = useState<SystrayIcon[]>([]);
  const availableIcons = zebar?.systray?.icons;
  if (iconLimit && iconLimit >= (availableIcons?.length ?? 0)) {
    iconLimit = undefined;
  }

  const iconsToShow = !iconLimit || expanded ? undefined : iconLimit;

  useEffect(() => {
    if ((availableIcons?.length ?? 0) === 0 && shownIcons.length === 0) {
      return;
    }
    const sortedIcons = sortComparator
      ? availableIcons?.sort(sortComparator)
      : availableIcons;
    setShownIcons(sortedIcons?.slice(0, iconsToShow) ?? []);
  }, [expanded, availableIcons, iconsToShow]);

  const expanderLabel = expanded ? "Collapse tray" : "Expand tray";

  const onClick = () => {
    setExpanded(!expanded);
  };

  const expandIcon =
    (expanded && expandAnchor === "start") ||
    (!expanded && expandAnchor === "start")
      ? resolveSpireImage("ui/compendium/settings_tiny_left_arrow")
      : resolveSpireImage("ui/compendium/settings_tiny_right_arrow");

  return (
    <SpRegion aria-label="System Tray">
      <SpStretchBox
        className={`system-tray system-tray--expand-${expandAnchor} ${expanded ? "system-tray--expanded" : ""}`}
        path="ui/top_bar/top_bar_char_backdrop"
        width={90}
        height={85}
        inset={30}
      >
        <div className="system-tray__interior">
          {iconLimit && (
            <SpMenuItem
              className="system-tray__expander"
              aria-label={expanderLabel}
              tooltip={expanderLabel}
              onClick={onClick}
            >
              <img
                src={expandIcon}
                aria-hidden="true"
              />
            </SpMenuItem>
          )}
          <div className="system-tray__icons">
            {shownIcons.map((data) => (
              <SpTrayIcon key={data.id} {...data} />
            ))}
          </div>
        </div>
      </SpStretchBox>
    </SpRegion>
  );
};
