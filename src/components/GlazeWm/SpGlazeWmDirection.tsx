import { useContext } from "react";
import { ZebarContext } from "../../contexts";
import SpTooltip from "../SpTooltip";
import { SpButton } from "../SpButton/SpButton";
import SpPower from "../SpPower";

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
            className={`sp-glazewm-tiling-direction sp-glazewm-tiling-direction--${direction}`}
            aria-label={label}
            aria-describedby={id}
            onClick={onClick}
          >
            <SpPower path={path} />
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
