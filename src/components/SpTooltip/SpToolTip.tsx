import { useId, type ReactNode } from "react";
import "./SpTooltip.css";

export interface SpTooltipProps {
  anchor: (id: string) => ReactNode;
  children: ReactNode;
}

const SpTooltip = ({ anchor, children }: SpTooltipProps) => {
  const id = useId();
  return (
    <div className="tooltip-shrinkwrap">
      {anchor(id)}
      <div id={id} className="tooltip" role="tooltip">
        {children}
      </div>
    </div>
  );
};
export default SpTooltip;
