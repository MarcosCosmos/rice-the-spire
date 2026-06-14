import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";
import SpSpireImage from "../SpSpireImage";
import useDataSize from "../../util/useDataSize";
import { SpNum } from "../SpTooltip";
import SpCrossout from "../SpCrossout";

const SpNetwork = () => {
  const zebar = useContext(ZebarContext);
  const gateway = zebar?.network?.defaultGateway;
  console.log(zebar?.network);
  const traffic = zebar?.network?.traffic;
  const transmitted = traffic?.transmitted && useDataSize(traffic.transmitted);
  const received = traffic?.received && useDataSize(traffic.received);
  const label = "Network";
  const tooltip = (
    <>
      <h1>{label}: </h1>
      {gateway?.ssid || "unknown"}
      <h1>Traffic: </h1>
      {transmitted && (
        <>
          <SpNum>{transmitted}</SpNum> transmitted
        </>
      )}
      ,{" "}
      {received && (
        <>
          <SpNum>{received}</SpNum> received
        </>
      )}
    </>
  );
  return (
    <SpMenuItem
      className="network"
      disabled
      aria-label={label}
      tooltip={tooltip}
    >
      <SpPower path="relics/gold_plated_cables">
        {traffic?.transmitted ? useDataSize(traffic.transmitted) : "-"}
        <br />
        {traffic?.received ? useDataSize(traffic.received) : "-"}
      </SpPower>
      {!gateway && <SpCrossout />}
    </SpMenuItem>
  );
};

export default SpNetwork;
