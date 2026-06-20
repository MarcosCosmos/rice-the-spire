import { useContext } from "react";
import ZebarContext from "../../contexts/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";
import "./SpBattery.css";

const assumedText = { text: "100%", font: "400 12px Kreon" };

export const SpBattery = () => {
  const zebar = useContext(ZebarContext);
  const data = zebar?.battery ?? {
    state: "unknown",
    chargePercent: 0,
  };

  if (data.state !== "unknown") {
    const value = Math.round(data.chargePercent);
    const label = "Battery";
    const eta =
      data.state === "charging" ? (
        <>
          charging - <strong>{data.timeTillFull}</strong> until full
        </>
      ) : (
        <>
          discharging - <strong>${data.timeTillEmpty}</strong> of charge
          remaining
        </>
      );
    const tooltip = (
      <>
        <h2>{label}: </h2>
        <strong>{value}%</strong> ({eta})
      </>
    );

    return (
      <SpMenuItem
        className={`battery battery--${data.state}`}
        disabled
        aria-label="Battery"
        tooltip={tooltip}
      >
        <SpPower path="relics/power_cell" assumedText={assumedText}>
          {value}%
        </SpPower>
      </SpMenuItem>
    );
  }

  return null;
};
