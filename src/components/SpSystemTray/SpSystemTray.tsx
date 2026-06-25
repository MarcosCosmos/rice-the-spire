import {
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { useNavigationGroup, ZebarContext } from "../../contexts";
import { SpTrayIcon } from "./SpTrayIcon";
import type { SystrayIcon } from "zebar";
import { SpStretchBox } from "../SpStretchBox";
import { SpButton } from "../SpButton/SpButton";
import SpTooltip from "../SpTooltip";
import "./SpSystemTray.css";
import SpSpireImage from "../SpSpireImage";

export interface SpSystemTrayProps {
  iconLimit?: number;
  sortComparator?: (a: SystrayIcon, b: SystrayIcon) => number;
  expandDirection?: "start" | "end";
  expandFloating?: boolean;
}

const stretchBoxConfig = {
  path: "ui/top_bar/top_bar_char_backdrop",
  width: 90,
  height: 85,
  inset: 30,
};
export const SpSystemTray = ({
  iconLimit,
  sortComparator,
  expandDirection,
  expandFloating,
}: SpSystemTrayProps) => {
  const id = useId();
  expandDirection ??= "start";
  expandFloating ??= false;
  const zebar = useContext(ZebarContext);

  const navAttrs = useNavigationGroup();

  const [expanded, setExpanded] = useState(false);
  const [sortedIcons, setSortedIcons] = useState<SystrayIcon[]>([]);

  const root = useRef<HTMLElement>(null);
  const refCallback = useCallback(
    (element: HTMLElement | null) => {
      navAttrs.ref(element);
      root.current = element;
    },
    [navAttrs.ref],
  );

  const availableIcons = zebar?.systray?.icons;
  if (iconLimit && iconLimit >= (availableIcons?.length ?? 0)) {
    iconLimit = undefined;
  }

  const iconsToShow = !iconLimit || expanded ? undefined : iconLimit;

  useEffect(() => {
    if ((availableIcons?.length ?? 0) === 0 && sortedIcons.length === 0) {
      return;
    }
    let result =
      (sortComparator
        ? availableIcons?.toSorted(sortComparator)
        : availableIcons) ?? [];
    if (expandDirection === "start") {
      result = result.toReversed();
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

  const expanderLabel = `Additional Icons (${(sortedIcons.length - (iconLimit ?? 0)).toFixed(0)})`;

  const onExpanderClick = () => {
    setExpanded(!expanded);
  };

  const onBlur = (event: FocusEvent) => {
    if (
      !event.relatedTarget ||
      !root.current ||
      !(
        root.current.compareDocumentPosition(event.relatedTarget) &
        Node.DOCUMENT_POSITION_CONTAINED_BY
      )
    ) {
      setExpanded(false);
    }
  };

  const onEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setExpanded(false);
    }
  };

  const secondaryIconsKey = `systray-${id}__secondary-icons`;
  const expanderPath =
    (expandDirection === "start" && !expanded) ||
    (expandDirection === "end" && expanded)
      ? "ui/compendium/settings_tiny_left_arrow"
      : "ui/compendium/settings_tiny_right_arrow";
  const expander = (
    <SpTooltip
      anchor={(tooltipId) => (
        <SpButton
          className="tray-icon system-tray__expander"
          role="menuitem"
          aria-label={expanderLabel}
          aria-describedby={tooltipId}
          aria-expanded={expanded}
          aria-controls={secondaryIconsKey}
          onClick={onExpanderClick}
        >
          <SpSpireImage path={expanderPath} />
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

  // todo: use margin trickery tob improve expansion animation (having the items flow out from beneath each other instead of just growing?)

  return (
    <div
      className={`system-tray system-tray--expand-${expandDirection} ${expanded ? "system-tray--expanded" : ""} ${expandFloating ? "system-tray--expand-floating" : ""}`}
      role="menubar"
      aria-label="System Tray"
      onKeyDown={onEscape}
      onBlur={onBlur}
      style={style}
      {...navAttrs}
      ref={refCallback}
    >
      <SpStretchBox {...stretchBoxConfig}>
        <div className="system-tray__interior">
          {expandDirection === "end" ? (
            <>
              <div className="system-tray__icons">
                {primaryIcons.map((data) => (
                  <SpTrayIcon key={data.id} {...data} />
                ))}
                {secondaryIcons.length > 0 && expander}
              </div>
              {secondaryIcons.length > 0 && (
                <>
                  <div
                    className="system-tray__icons system-tray__secondary-icons"
                    role="menu"
                    id={secondaryIconsKey}
                    key={secondaryIconsKey}
                  >
                    {secondaryIcons.map((data) => (
                      <SpTrayIcon
                        key={data.id}
                        {...data}
                        disabled={!expanded}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {secondaryIcons.length > 0 && (
                <div
                  className="system-tray__icons system-tray__secondary-icons"
                  role="menu"
                  id={secondaryIconsKey}
                  key={secondaryIconsKey}
                >
                  {secondaryIcons.map((data) => (
                    <SpTrayIcon key={data.id} {...data} disabled={!expanded} />
                  ))}
                </div>
              )}
              <div className="system-tray__icons">
                {secondaryIcons.length > 0 && expander}
                {primaryIcons.map((data) => (
                  <SpTrayIcon key={data.id} {...data} />
                ))}
              </div>
            </>
          )}
        </div>
      </SpStretchBox>
    </div>
  );
};
