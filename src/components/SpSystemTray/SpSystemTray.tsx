import { useContext, useEffect, useState } from "react";
import SpRegion from "../SpRegion";
import "./SpSystemTray.css";
import { ZebarContext } from "../../contexts";
import { SpTrayIcon } from "./SpTrayIcon";
import SpMenuItem from "../SpMenuItem";
import { PotionBelt } from "./PotionBelt";
import type { SystrayIcon } from "zebar";

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

  return (
    <SpRegion aria-label="System Tray">
      <PotionBelt>
        <div
          className={`system-tray system-tray--expand-${expandAnchor} ${expanded ? "system-tray--expanded" : ""}`}
        >
          {iconLimit && (
            <SpMenuItem
              className="system-tray__expander"
              aria-label={expanderLabel}
              tooltip={expanderLabel}
              onClick={onClick}
            />
          )}
          <div className="system-tray__icons">
            {shownIcons.map((data) => (
              <SpTrayIcon key={data.id} {...data} />
            ))}
          </div>
        </div>
      </PotionBelt>
    </SpRegion>
  );
};
