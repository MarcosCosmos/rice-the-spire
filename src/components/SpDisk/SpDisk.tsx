import SpPower from "../SpPower";
import useDataSize from "../../util/useDataSize";
import type { Disk as ZDisk } from "zebar";
import SpTooltip from "../SpTooltip";
import SpNote from "../SpNote";

export interface DiskProps {
  data: ZDisk;
  label?: string;
}

const assumedText = "100%";

export const SpDisk = ({ data, label, ...attrs }: DiskProps) => {
  label ??= "Disk";
  const usage = Math.round(
    ((data.totalSpace.bytes - data.availableSpace.bytes) /
      data.totalSpace.bytes) *
      100,
  );
  const name = data.name ?? data.mountPoint;
  return (
    <SpTooltip
      anchor={(id) => (
        <SpNote
          className="sp-disk"
          aria-label="Disk"
          aria-describedby={id}
          {...attrs}
        >
          <SpPower path="relics/data_disk" expectedText={assumedText}>
            {usage}%
          </SpPower>
        </SpNote>
      )}
      desc={
        <>
          <h2>{label}: </h2>
          {name} {data.isRemovable ? " (removable)" : ""} <h2>Used space: </h2>
          <strong>{useDataSize(data.availableSpace)}</strong>/
          <strong>{useDataSize(data.totalSpace)}</strong> <h2>Mounted at: </h2>
          {data.mountPoint}
        </>
      }
    />
  );
};
