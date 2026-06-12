import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";

const SpProcessor = () => {
  const zebar = useContext(ZebarContext);
  const cpu = zebar?.cpu;
  const usage = Math.round(cpu?.usage || 0);
  const tooltip = `CPU Usage: ${!!usage ? usage + "%" : "unknown"}`;

  return (
    <SpMenuItem className="cpu" aria-label="CPU" tooltip={tooltip} disabled>
      <SpPower path="relics/cracked_core">{usage}%</SpPower>
    </SpMenuItem>
  );
};

export default SpProcessor;
