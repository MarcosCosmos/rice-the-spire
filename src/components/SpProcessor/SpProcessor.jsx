import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpStatus from "../SpStatus";

const SpProcessor = () => {
  const zebar = useContext(ZebarContext);
  const cpu = zebar?.cpu;
  const usage = Math.round(cpu?.usage || 0);
  const tooltip = cpu && `CPU Usage: ${usage}%`;

  return (
    <SpMenuItem className="cpu" aria-label="CPU" tooltip={tooltip} disabled>
      <SpStatus path="relics/cracked_core">{usage}%</SpStatus>
    </SpMenuItem>
  );
};

export default SpProcessor;
