import { useContext, useId, type ReactNode } from "react";
import "./SpTooltip.css";
import { TooltipTargetingContext } from "../../contexts";

export interface SpTooltipProps {
  anchor: (id: string) => ReactNode;
  children: ReactNode;
}

const SpTooltip = ({ anchor, children }: SpTooltipProps) => {
  const id = useId();
  const tooltipTargetingContext = useContext(TooltipTargetingContext);
  const isFocal = tooltipTargetingContext?.targetId === id;
  const takeFocal = () => {
    console.log("hi", id);
    tooltipTargetingContext?.updateTarget(id);
  };
  return (
    <div
      className={`tooltip ${isFocal ? "tooltip--focal" : ""}`}
      onFocus={takeFocal}
      onMouseEnter={takeFocal}
    >
      {anchor(id)}
      <div id={id} className="tooltip__box" role="tooltip" key={id}>
        {children}
      </div>
    </div>
  );
};
export default SpTooltip;
