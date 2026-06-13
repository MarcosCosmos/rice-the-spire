import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";
import { SpNum } from "../SpTooltip";

const SpProcessor = () => {
  const zebar = useContext(ZebarContext);
  const cpu = zebar?.cpu;
  const usage = Math.round(cpu?.usage || 0);
  const label = "CPU";
  const tooltip = (
    <>
      <h1>{label} usage: </h1>
      {(usage && <SpNum>{usage}%</SpNum>) || "unknown"}
    </>
  );
  return (
    <SpMenuItem className="cpu" aria-label={label} tooltip={tooltip} disabled>
      <SpPower path="relics/cracked_core">{usage}%</SpPower>
    </SpMenuItem>
  );
};

export default SpProcessor;
