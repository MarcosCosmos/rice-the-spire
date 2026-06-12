import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";
import useDataSize from "../../util/useDataSize";
import type { Disk as ZDisk } from "zebar";

export interface DiskProps {
  data: ZDisk;
  label?: string;
}

const Disk = ({ data, label, ...attrs }: DiskProps) => {
  label ||= "Disk";
  const usage = Math.round(
    ((data.totalSpace.bytes - data.availableSpace.bytes) /
      data.totalSpace.bytes) *
      100,
  );
  const name = data.name || data.mountPoint;
  const tooltip = `${label}: ${name} ${data.isRemovable ? "(removable)" : ""};  ${useDataSize(data.availableSpace)}/${useDataSize(data.totalSpace)} available; mounted at: ${data.mountPoint}.`;

  return (
    <SpMenuItem
      className="disk"
      disabled
      tooltip={tooltip}
      aria-label={label}
      {...attrs}
    >
      <SpPower path="relics/data_disk">{usage}%</SpPower>
    </SpMenuItem>
  );
};

export default Disk;
