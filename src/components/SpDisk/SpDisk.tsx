import SpMenuItem from "../SpMenuItem";
import SpStatus from "../SpStatus";
import useDataSize from "../../util/useDataSize";
import type { Disk as ZDisk } from "zebar";

export interface DiskProps extends Record<string, any> {
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
  const tooltip = `${label}: ${name} ${data.isRemovable ? "(removable)" : ""}; usage: ${useDataSize(data.availableSpace)}/${useDataSize(data.totalSpace)}; mounted at: ${data.mountPoint}.`;

  return (
    <SpMenuItem
      className="disk"
      disabled
      tooltip={tooltip}
      aria-label={label}
      {...attrs}
    >
      <SpStatus path="relics/data_disk">{usage}%</SpStatus>
    </SpMenuItem>
  );
};

export default Disk;
