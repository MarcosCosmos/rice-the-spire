import {
  useContext,
  useId,
  type DetailedHTMLProps,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import "./SpTooltip.css";
import { TooltipFocusContext } from "../../contexts";

export interface SpTooltipProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  className?: string;
  anchor: (id: string) => ReactNode;
  desc: ReactNode;
}

/**
 * Much like stretchbox, tooltip is intentionally opaque and should not be treated as an accessible element
 */
export const SpTooltip = ({ anchor, desc }: SpTooltipProps) => {
  const id = useId();
  const tooltipFocusContext = useContext(TooltipFocusContext);
  const isFocal = tooltipFocusContext?.targetId === id;
  const takeFocal = () => {
    tooltipFocusContext?.update(id);
  };
  return (
    <div
      className={`sp-tooltip ${isFocal ? "sp-tooltip--focal" : ""}`}
      onFocus={takeFocal}
      onMouseEnter={takeFocal}
    >
      <div className="sp-tooltip__hover-wrapper">
        <div className="sp-tooltip__hover-zone"></div>
      </div>
      <div className="sp-tooltip__anchor">{anchor(id)}</div>
      <div className="sp-tooltip__box-wrapper">
        <div id={id} className="sp-tooltip__box" role="tooltip" key={id}>
          {desc}
        </div>
      </div>
    </div>
  );
};
