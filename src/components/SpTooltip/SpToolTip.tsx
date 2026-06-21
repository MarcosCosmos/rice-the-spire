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

export const SpTooltip = ({
  className,
  anchor,
  desc,
  ...attrs
}: SpTooltipProps) => {
  className ??= "";
  const id = useId();
  const tooltipFocusContext = useContext(TooltipFocusContext);
  const isFocal = tooltipFocusContext?.targetId === id;
  const takeFocal = () => {
    tooltipFocusContext?.update(id);
  };
  return (
    <div
      className={`tooltip ${isFocal ? "tooltip--focal" : ""} ${className}`}
      onFocus={takeFocal}
      onMouseEnter={takeFocal}
      {...attrs}
    >
      {anchor(id)}
      <div id={id} className="tooltip__box" role="tooltip" key={id}>
        {desc}
      </div>
    </div>
  );
};
