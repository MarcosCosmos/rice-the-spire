import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import { MenuItem } from "../";
import { Status } from "../";

const Processor = () => {
  const zebar = useContext(ZebarContext);
  const cpu = zebar?.cpu;
  const usage = Math.round(cpu?.usage || 0);
  const tooltip = cpu && `CPU Usage: ${usage}%`;

  return (
    <MenuItem className="cpu" aria-label="CPU" tooltip={tooltip} disabled>
      <Status path="relics/cracked_core">{usage}%</Status>
    </MenuItem>
  );
};

export default Processor;
