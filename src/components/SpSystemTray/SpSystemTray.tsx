import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import {
  NavigationContext,
  useNavigationGroup,
  ZebarContext,
} from "../../contexts";
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

  const { navAttrs, navigation } = useNavigationGroup();

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

  const expanderLabel = expanded ? "Collapse tray" : "Expand tray";

  const onExpanderClick = () => {
    setExpanded(!expanded);
  };

  const onBlur = (event: FocusEvent) => {
    console.log(root.current, event.relatedTarget);
    if (
      !event.relatedTarget ||
      !root.current ||
      !(
        root.current.compareDocumentPosition(event.relatedTarget) &
        Node.DOCUMENT_POSITION_CONTAINED_BY
      )
    ) {
      console.log(
        "not inside",
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        event.relatedTarget &&
          root.current?.compareDocumentPosition(event.relatedTarget),
      );
      setExpanded(false);
    }
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

  // todo: use margin trickery tob improve expansion animation (having the items flow out from beneath each other instead of just growing?)

  return (
    <div
      className={`system-tray system-tray--expand-${expandDirection} ${expanded ? "system-tray--expanded" : ""} ${expandFloating ? "system-tray--expand-floating" : ""}`}
      style={style}
      role="toolbar"
      aria-label="System Tray"
      onKeyDown={onEscape}
      onBlur={onBlur}
      {...navAttrs}
      ref={refCallback}
    >
      <SpStretchBox
        className="system-tray__exterior"
        path="ui/top_bar/top_bar_char_backdrop"
        width={90}
        height={85}
        inset={30}
      >
        <div className="system-tray__interior">
          <NavigationContext value={navigation}>
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
          </NavigationContext>
        </div>
      </SpStretchBox>
    </div>
  );
};
