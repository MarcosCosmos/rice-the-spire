import { useContext } from "react";
import ZebarContext from "../../contexts/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";
import useDataSize from "../../util/useDataSize";

export const SpNetwork = () => {
  const zebar = useContext(ZebarContext);
  const gateway = zebar?.network?.defaultGateway;
  const traffic = zebar?.network?.traffic;
  const transmitted = traffic?.transmitted && useDataSize(traffic.transmitted);
  const received = traffic?.received && useDataSize(traffic.received);
  const label = "Network";
  const tooltip = (
    <>
      <h2>{label}: </h2>
      {gateway?.ssid ?? "unknown"} <h2>Traffic: </h2>
      {transmitted && (
        <>
          <strong>{transmitted}</strong> transmitted
        </>
      )}
      ,{" "}
      {received && (
        <>
          <strong>{received}</strong> received
        </>
      )}
    </>
  );
  const path = gateway
    ? "relics/gold_plated_cables"
    : ["relics/gold_plated_cables", "powers/well_laid_plans"];
  return (
    <SpMenuItem
      className="network"
      disabled
      aria-label={label}
      tooltip={tooltip}
    >
      <SpPower path={path}>
        {traffic?.transmitted ? useDataSize(traffic.transmitted) : "-"}
        <br />
        {traffic?.received ? useDataSize(traffic.received) : "-"}
      </SpPower>
    </SpMenuItem>
  );
};
