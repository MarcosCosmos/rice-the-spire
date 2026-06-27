import { useContext } from "react";
import ZebarContext from "../../contexts/ZebarContext";
import SpPower from "../SpPower";
import SpTooltip from "../SpTooltip";
import SpNote from "../SpNote";

const assumedText = { text: "100%", font: "400 12px Kreon" };

export const SpProcessor = () => {
  const zebar = useContext(ZebarContext);
  const cpu = zebar?.cpu;
  const usage = Math.round(cpu?.usage ?? 0);
  const label = "CPU";
  return (
    <SpTooltip
      anchor={(id) => (
        <SpNote className="cpu" aria-label={label} aria-describedby={id}>
          <SpPower path="relics/cracked_core" expectedText={assumedText}>
            {usage}%
          </SpPower>
        </SpNote>
      )}
      desc={
        <>
          <h2>{label} usage: </h2>
          {cpu ? <strong>{usage.toFixed(0)}%</strong> : "unknown"}
        </>
      }
    />
  );
};
