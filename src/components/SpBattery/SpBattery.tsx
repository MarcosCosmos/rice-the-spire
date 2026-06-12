import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";
import "./SpBattery.css";

const SpBattery = () => {
  const zebar = useContext(ZebarContext);
  const data = zebar?.battery || {
    state: "unknown",
    chargePercent: 0,
  };

  if (data.state !== "unknown") {
    const value = Math.round(data.chargePercent);
    return (
      <SpMenuItem
        className={`battery battery--${data.state}`}
        disabled
        aria-label="SpBattery"
        tooltip={`SpBattery: ${value}% (${data.state})`}
      >
        <SpPower path="relics/power_cell">{value}%</SpPower>
      </SpMenuItem>
    );
  }

  return null;
};

export default SpBattery;
