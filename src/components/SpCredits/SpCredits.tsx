import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";
import SpSpireImage from "../SpSpireImage";
import "./SpCredits.css";

const SpCredits = () => {
  const label = "Credits";
  const tooltip = (
    <>
      <h1>Bar author: </h1>
      <a href="https://github.com/MarcosCosmos">
        <SpSpireImage path="ui/characters/character_icon_defect" />
        MarcosCosmos
      </a>
      <h1>Assets belong to: </h1>
      <a href="https://store.steampowered.com/app/2868840/Slay_the_Spire_2/">
        <SpSpireImage path="ui/misc/icon_1024" />
        Slay the Spire 2
      </a>{" "}
      (&copy; <a href="http://megacrit.com/">MegaCrit</a>)
      <h1>Assets & API provided via: </h1>
      <a href="https://spire-codex.com/">
        <img src="https://spire-codex.com/spire-codex-white-final.png" />
        Spire Codex
      </a>
    </>
  );
  return (
    <SpMenuItem className="credits" aria-label={label} tooltip={tooltip}>
      <SpPower path="powers/subroutine" />
    </SpMenuItem>
  );
};
export default SpCredits;
