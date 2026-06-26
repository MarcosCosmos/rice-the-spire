import type { MouseEventHandler } from "react";
import { SpButton } from "../SpButton/SpButton";
import SpSpireImage from "../SpSpireImage";
import SpTooltip from "../SpTooltip";
import "./ExhaustButton.css";
import SpOutlinedText from "../SpOutlinedText";

export interface PileButtonProps {
  controls: string;
  count: number;
  expanded: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}
export const ExhaustButton = ({
  controls,
  count,
  expanded,
  onClick,
}: PileButtonProps) => {
  const label = `Additional Icons (${count.toFixed(0)})`;
  return (
    <SpTooltip
      anchor={(tooltipId) => (
        <SpButton
          className="pile-button"
          role="menuitem"
          aria-label={label}
          aria-describedby={tooltipId}
          aria-expanded={expanded}
          aria-controls={controls}
          onClick={onClick}
          toggle
        >
          <SpSpireImage path="ui/compendium/exhaust_pile" />
          <SpOutlinedText>{count}</SpOutlinedText>
        </SpButton>
      )}
      desc={label}
    />
  );
};
