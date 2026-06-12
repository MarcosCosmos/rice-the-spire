import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import { MenuItem } from "../";
import { Status } from "../";
import { SpireImage } from "../";
import useDataSize from "../../util/useDataSize";

const Network = () => {
  const zebar = useContext(ZebarContext);
  const currentInterface = zebar?.network?.defaultInterface;
  const traffic = zebar?.network?.traffic;

  return (
    <MenuItem
      className="network"
      disabled
      aria-label="Network"
      tooltip="Network: {{TODO}}"
    >
      <Status path="relics/gold_plated_cables">
        {traffic?.transmitted ? useDataSize(traffic.transmitted) : "-"}
        <br />
        {traffic?.received ? useDataSize(traffic.received) : "-"}
      </Status>
      {!currentInterface && (
        <SpireImage
          className="network-none-icon"
          path="powers/well_laid_plans"
        />
      )}
    </MenuItem>
  );
};

export default Network;
