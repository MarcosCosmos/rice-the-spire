import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";

const SpMemory = () => {
  const zebar = useContext(ZebarContext);
  const memory = zebar?.memory;
  const usage = Math.round(memory?.usage || 0);
  const tooltip =
    memory &&
    `SpMemory usage: ${(memory.usedMemory * 1e-9).toFixed(2)}GB/${(memory.totalMemory * 1e-9).toFixed(2)}GB (${(memory.freeMemory * 1e-9).toFixed(2)}GB free)`;

  return (
    <SpMenuItem
      className="memory"
      aria-label="SpMemory"
      tooltip={tooltip}
      disabled
    >
      <SpPower path="relics/emotion_chip">{usage}%</SpPower>
    </SpMenuItem>
  );
};

export default SpMemory;
