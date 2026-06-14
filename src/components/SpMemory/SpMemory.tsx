import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";

const SpMemory = () => {
  const zebar = useContext(ZebarContext);
  const memory = zebar?.memory;
  const usage = Math.round(memory?.usage || 0);
  const label = "Memory";
  const tooltip = (
    <>
      <h2>{label} usage: </h2>
      {(memory && (
        <>
          <strong>{usage}%</strong> (
          <strong>{(memory!.freeMemory * 1e-9).toFixed(2)}GB</strong>/
          <strong>{(memory!.totalMemory * 1e-9).toFixed(2)}GB</strong> free)
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
