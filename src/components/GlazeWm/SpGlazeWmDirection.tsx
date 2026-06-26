import { useContext } from "react";
import { ZebarContext } from "../../contexts";
import SpSpireImage from "../SpSpireImage";
import SpTooltip from "../SpTooltip";
import { SpButton } from "../SpButton/SpButton";

export const SpGlazeWmDirection = () => {
  const glazewm = useContext(ZebarContext)?.glazewm;
  if (glazewm) {
    const direction = glazewm.tilingDirection;
    const path = {
      horizontal: "intents/escape",
      vertical: "intents/debuff",
    }[direction];
    const onClick = () => {
      void glazewm.runCommand("toggle-tiling-direction");
    };
    const label = `Tiling direction`;

    return (
      <SpTooltip
        anchor={(id) => (
          <SpButton
            className={`glazewm-tiling-direction glazewm-tiling-direction--${direction}`}
            aria-label={label}
            aria-describedby={id}
            onClick={onClick}
          >
            <SpSpireImage path={path} />
          </SpButton>
        )}
        desc={
          <>
            <h2>Tiling direction: </h2>
            <strong>{direction}</strong>
          </>
        }
      />
    );
  }
};
export default SpGlazeWmDirection;
