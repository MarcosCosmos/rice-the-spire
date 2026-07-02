import { useContext } from "react";
import ZebarContext from "../../contexts/ZebarContext";
import SpPower from "../SpPower";
import "./SpBattery.css";
import SpTooltip from "../SpTooltip";
import SpNote from "../SpNote";
const assumedText = "100%";

export const SpBattery = () => {
  const zebar = useContext(ZebarContext);
  const data = zebar?.battery ?? {
    state: "unknown",
    chargePercent: 0,
  };

  if (data.state !== "unknown") {
    const value = Math.round(data.chargePercent);
    const label = "Battery";
    return (
      <SpTooltip
        anchor={(id) => (
          <SpNote
            className={`sp-battery sp-battery--${data.state}`}
            aria-label={label}
            aria-describedby={id}
          >
            <SpPower path="relics/power_cell" expectedText={assumedText}>
              {value}%
            </SpPower>
          </SpNote>
        )}
        desc={
          <>
            <h2>{label}: </h2>
            <strong>{value}%</strong> (
            {data.state === "charging" ? (
              <>
                charging{" "}
                {data.timeTillFull && (
                  <>
                    - <strong>{data.timeTillFull}</strong> until full
                  </>
                )}
              </>
            ) : (
              <>
                discharging
                {data.timeTillFull && (
                  <>
                    - <strong>{data.timeTillEmpty}</strong> of charge remaining
                  </>
                )}
              </>
            )}
            )
          </>
        }
      />
    );
  }

  return null;
};
