import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";
import SpSpireImage from "../SpSpireImage";
import useDataSize from "../../util/useDataSize";

const SpNetwork = () => {
  const zebar = useContext(ZebarContext);
  const currentInterface = zebar?.network?.defaultInterface;
  const traffic = zebar?.network?.traffic;

  return (
    <SpMenuItem
      className="network"
      disabled
      aria-label="Network"
      tooltip="Network: {{TODO}}"
    >
      <SpPower path="relics/gold_plated_cables">
        {traffic?.transmitted ? useDataSize(traffic.transmitted) : "-"}
        <br />
        {traffic?.received ? useDataSize(traffic.received) : "-"}
      </SpPower>
      {!currentInterface && (
        <SpSpireImage
          className="network-none-icon"
          path="powers/well_laid_plans"
        />
      )}
    </SpMenuItem>
  );
};

export default SpNetwork;
