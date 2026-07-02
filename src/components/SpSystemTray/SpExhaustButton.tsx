import type { MouseEventHandler } from "react";
import { SpButton } from "../SpButton/SpButton";
import SpIcon from "../SpIcon";
import SpTooltip from "../SpTooltip";
import "./SpExhaustButton.css";
import SpOutlinedText from "../SpOutlinedText";

export interface SpExhaustButtonProps {
  controls: string;
  count: number;
  expanded: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}
export const SpExhaustButton = ({
  controls,
  count,
  expanded,
  onClick,
}: SpExhaustButtonProps) => {
  const label = `Additional Icons (${count.toFixed(0)})`;
  return (
    <SpTooltip
      anchor={(tooltipId) => (
        <SpButton
          className="sp-exhaust-button"
          role="menuitem"
          aria-label={label}
          aria-describedby={tooltipId}
          aria-expanded={expanded}
          aria-controls={controls}
          onClick={onClick}
          toggle
        >
          <SpIcon
            className="sp-exhaust-button__icon"
            path="ui/compendium/exhaust_pile"
          />
          <SpOutlinedText>{count}</SpOutlinedText>
        </SpButton>
      )}
      desc={label}
    />
  );
};
