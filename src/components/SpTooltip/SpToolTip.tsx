import { useContext, useId, type ReactNode } from "react";
import "./SpTooltip.css";
import { TooltipTargetingContext } from "../../contexts";

export interface SpTooltipProps {
  className?: string;
  anchor: (id: string) => ReactNode;
  children: ReactNode;
}

export const SpTooltip = ({ className, anchor, children }: SpTooltipProps) => {
  className ??= "";
  const id = useId();
  const tooltipTargetingContext = useContext(TooltipTargetingContext);
  const isFocal = tooltipTargetingContext?.targetId === id;
  const takeFocal = () => {
    tooltipTargetingContext?.updateTarget(id);
  };
  return (
    <div
      className={`tooltip ${isFocal ? "tooltip--focal" : ""} ${className}`}
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
