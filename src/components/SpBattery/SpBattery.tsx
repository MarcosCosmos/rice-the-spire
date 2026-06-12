import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpStatus from "../SpStatus";

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
        <SpStatus path="relics/power_cell">{value}%</SpStatus>
      </SpMenuItem>
    );
  }

  return null;
};

export default SpBattery;
