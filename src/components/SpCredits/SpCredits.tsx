import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";
import SpSpireImage from "../SpSpireImage";
import "./SpCredits.css";

const SpCredits = () => {
  const label = "Credits";
  const tooltip = (
    <>
      <h1>Author: </h1>
      <SpSpireImage path="ui/characters/character_icon_defect" />
      MarcosCosmos
      <h1>Assets belong to: </h1>
      <SpSpireImage path="ui/misc/icon_1024" />
      Slay the Spire 2 (&copy; MegaCrit)
      <h1>Assets & API provided via: </h1>
      <img src="https://spire-codex.com/spire-codex-white-final.png" />
      Spire Codex
    </>
  );
  return (
    <SpMenuItem
      className="credits"
      disabled
      aria-label={label}
      tooltip={tooltip}
    >
      <SpPower path="powers/subroutine" />
    </SpMenuItem>
  );
};
export default SpCredits;
