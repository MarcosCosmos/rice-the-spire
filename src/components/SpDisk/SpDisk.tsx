import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";
import useDataSize from "../../util/useDataSize";
import type { Disk as ZDisk } from "zebar";
import { SpNum } from "../SpTooltip";

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
  const tooltip = (
    <>
      <h1>{label}: </h1>
      {name}
      {data.isRemovable ? " (removable)" : ""}
      <h1>Used space: </h1>
      <SpNum>{useDataSize(data.availableSpace)}</SpNum>/
      <SpNum>{useDataSize(data.totalSpace)}</SpNum>
      <h1>Mounted at: </h1>
      {data.mountPoint}
    </>
  );
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
