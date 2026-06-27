import { useContext } from "react";
import ZebarContext from "../../contexts/ZebarContext";
import SpPower from "../SpPower";
import useDataSize from "../../util/useDataSize";
import "./SpNetwork.css";
import { widestDigit, widestUnitChar } from "../../util/measureText";
import SpTooltip from "../SpTooltip";
import SpNote from "../SpNote";

const assumedText = {
  text: `${widestDigit.repeat(2)}.${widestDigit.repeat(2)}${widestUnitChar}B`,
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  font: `400 ${0.9 * 12}px Kreon`,
};

export const SpNetwork = () => {
  const zebar = useContext(ZebarContext);
  const gateway = zebar?.network?.defaultGateway;
  const traffic = zebar?.network?.traffic;
  const transmitted = traffic?.transmitted && useDataSize(traffic.transmitted);
  const received = traffic?.received && useDataSize(traffic.received);
  const label = "Network";
  const path = gateway
    ? "relics/gold_plated_cables"
    : ["relics/gold_plated_cables", "powers/well_laid_plans"];

  return (
    <SpTooltip
      anchor={(id) => (
        <SpNote className="network" aria-label={label} aria-describedby={id}>
          <SpPower path={path} expectedText={assumedText}>
            {traffic?.transmitted ? useDataSize(traffic.transmitted) : "-"}
            <br />
            {traffic?.received ? useDataSize(traffic.received) : "-"}
          </SpPower>
        </SpNote>
      )}
      desc={
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
      }
    />
  );
};
