import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpStatus from "../SpStatus";

const SpMemory = () => {
  const zebar = useContext(ZebarContext);
  const memory = zebar?.memory;
  const usage = Math.round(memory?.usage || 0);
  const tooltip =
    memory &&
    `SpMemory usage: ${(memory.usedSpMemory * 1e-9).toFixed(2)}GB/${(memory.totalSpMemory * 1e-9).toFixed(2)}GB (${(memory.freeSpMemory * 1e-9).toFixed(2)}GB free)`;

  return (
    <SpMenuItem className="memory" aria-label="SpMemory" tooltip={tooltip} disabled>
      <SpStatus path="relics/emotion_chip">{usage}%</SpStatus>
    </SpMenuItem>
  );
};

export default SpMemory;
