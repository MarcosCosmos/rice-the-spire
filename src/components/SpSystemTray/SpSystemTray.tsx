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
import "./SpSystemTray.css";
import { ExhaustButton } from "./ExhaustButton";

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
  const [[primaryIcons, secondaryIcons], setIconSets] = useState<
    [SystrayIcon[], SystrayIcon[]]
  >([[], []]);

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
    if (availableIcons && (sortComparator || expandDirection === "start")) {
      const result = [...availableIcons];
      if (sortComparator) {
        result.sort(sortComparator);
      }
      if (expandDirection === "start") {
        result.reverse();
      }
      setSortedIcons(result);
    } else {
      setSortedIcons(availableIcons ?? []);
    }
  }, [availableIcons, sortComparator, expandDirection]);

  useEffect(() => {
    setIconSets(
      expandDirection === "end"
        ? [
            sortedIcons.slice(0, iconLimit),
            iconLimit ? sortedIcons.slice(iconLimit) : [],
          ]
        : [
            sortedIcons.slice(iconLimit ? -iconLimit : 0),
            iconLimit ? sortedIcons.slice(0, -iconLimit) : [],
          ],
    );
  }, [sortedIcons, iconLimit, expandDirection]);

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

  const style: CSSProperties = {
    "--primary-icon-count": 1 + Math.min(iconLimit ?? 0, sortedIcons.length),
    "--secondary-icon-count": secondaryIcons.length,
  } as CSSProperties;

  const parts = [
    primaryIcons.map((data) => <SpTrayIcon key={data.id} {...data} />),
    secondaryIcons.length > 0 ? (
      <ExhaustButton
        controls={secondaryIconsKey}
        count={secondaryIcons.length}
        expanded={expanded}
        onClick={onExpanderClick}
      />
    ) : undefined,
    secondaryIcons.length > 0 && (
      <>
        <div
          className="system-tray__secondary-icons"
          role="menu"
          id={secondaryIconsKey}
          key={secondaryIconsKey}
        >
          {secondaryIcons.map((data) => (
            <SpTrayIcon key={data.id} {...data} disabled={!expanded} />
          ))}
        </div>
      </>
    ),
  ];
  if (expandDirection === "start") {
    parts.reverse();
  }

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
          <div className="system-tray__icons">{parts}</div>
        </div>
      </SpStretchBox>
    </div>
  );
};
