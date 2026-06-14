import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";

const SpProcessor = () => {
  const zebar = useContext(ZebarContext);
  const cpu = zebar?.cpu;
  const usage = Math.round(cpu?.usage || 0);
  const label = "CPU";
  const tooltip = (
    <>
      <h2>{label} usage: </h2>
      {(usage && <strong>{usage}%</strong>) || "unknown"}
    </>
  );
  return (
    <SpMenuItem className="cpu" aria-label={label} tooltip={tooltip} disabled>
      <SpPower path="relics/cracked_core">{usage}%</SpPower>
    </SpMenuItem>
  );
};

export default SpProcessor;
