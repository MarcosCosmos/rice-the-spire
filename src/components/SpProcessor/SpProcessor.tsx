import { useContext } from "react";
import ZebarContext from "../../contexts/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";

const assumedText = { text: "100%", font: "400 12px Kreon" };

export const SpProcessor = () => {
  const zebar = useContext(ZebarContext);
  const cpu = zebar?.cpu;
  const usage = Math.round(cpu?.usage ?? 0);
  const label = "CPU";
  const tooltip = (
    <>
      <h2>{label} usage: </h2>
      {cpu ? <strong>{usage.toFixed(0)}%</strong> : "unknown"}
    </>
  );
  return (
    <SpMenuItem className="cpu" aria-label={label} tooltip={tooltip} disabled>
      <SpPower path="relics/cracked_core" assumedText={assumedText}>
        {usage}%
      </SpPower>
    </SpMenuItem>
  );
};
