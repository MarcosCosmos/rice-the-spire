import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";
import "./SpBattery.css";
import { SpNum } from "../SpTooltip";

const SpBattery = () => {
  const zebar = useContext(ZebarContext);
  const data = zebar?.battery || {
    state: "unknown",
    chargePercent: 0,
  };

  if (data.state !== "unknown") {
    const value = Math.round(data.chargePercent);
    const label = "Battery";
    const eta =
      data.state === "charging" ? (
        <>
          charging - <SpNum>{data.timeTillFull}</SpNum> until full
        </>
      ) : (
        <>
          discharging - <SpNum>${data.timeTillEmpty}</SpNum> of charge remaining
        </>
      );
    const tooltip = (
      <>
        <h1>{label}: </h1>
        <SpNum>{value}%</SpNum> ({eta})
      </>
    );

    return (
      <SpMenuItem
        className={`battery battery--${data.state}`}
        disabled
        aria-label="Battery"
        tooltip={tooltip}
      >
        <SpPower path="relics/power_cell">{value}%</SpPower>
      </SpMenuItem>
    );
  }

  return null;
};

export default SpBattery;
