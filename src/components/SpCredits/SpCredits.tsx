import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";
import SpSpireImage from "../SpSpireImage";
import "./SpCredits.css";

export const SpCredits = () => {
  const label = "Credits";
  const tooltip = (
    <>
      <h2>Author: </h2>
      <SpSpireImage path="ui/characters/character_icon_defect" />
      MarcosCosmos
      <h2>Assets belong to: </h2>
      <SpSpireImage path="ui/misc/icon_1024" />
      Slay the Spire 2 (&copy; Mega Crit)
      <h2>Assets & data served via: </h2>
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
