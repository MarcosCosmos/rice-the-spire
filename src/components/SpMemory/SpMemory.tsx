import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";
import { SpNum } from "../SpTooltip";

const SpMemory = () => {
  const zebar = useContext(ZebarContext);
  const memory = zebar?.memory;
  const usage = Math.round(memory?.usage || 0);
  const label = "Memory";
  const tooltip = (
    <>
      <h1>{label} usage: </h1>
      {(memory && (
        <>
          <SpNum>{usage}%</SpNum> (
          <SpNum>{(memory!.freeMemory * 1e-9).toFixed(2)}GB</SpNum>/
          <SpNum>{(memory!.totalMemory * 1e-9).toFixed(2)}GB</SpNum> free)
        </>
      )) ||
        "unknown"}
    </>
  );

  return (
    <SpMenuItem
      className="memory"
      aria-label={label}
      tooltip={tooltip}
      disabled
    >
      <SpPower path="relics/emotion_chip">{usage}%</SpPower>
    </SpMenuItem>
  );
};

export default SpMemory;
