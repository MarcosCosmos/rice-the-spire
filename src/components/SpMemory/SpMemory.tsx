import { useContext } from "react";
import ZebarContext from "../../contexts/ZebarContext";
import SpPower from "../SpPower";
import SpTooltip from "../SpTooltip";
import SpNote from "../SpNote";

const assumedText = { text: "100%", font: "400 12px Kreon" };

export const SpMemory = () => {
  const zebar = useContext(ZebarContext);
  const memory = zebar?.memory;
  const usage = Math.round(memory?.usage ?? 0);
  const label = "Memory";

  return (
    <SpTooltip
      anchor={(id) => (
        <SpNote className="memory" aria-label={label} aria-describedby={id}>
          <SpPower path="relics/emotion_chip" assumedText={assumedText}>
            {usage}%
          </SpPower>
        </SpNote>
      )}
      desc={
        <>
          <h2>{label} usage: </h2>
          {memory ? (
            <>
              <strong>{usage}%</strong> (
              <strong>{(memory.freeMemory * 1e-9).toFixed(2)}GB</strong>/
              <strong>{(memory.totalMemory * 1e-9).toFixed(2)}GB</strong> free)
            </>
          ) : (
            "unknown"
          )}
        </>
      }
    />
  );
};
