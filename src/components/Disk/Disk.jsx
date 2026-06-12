import MenuItem from "../MenuItem";
import Status from "../Status";
import useDataSize from "../../util/useDataSize";

const Disk = ({ data, label, ...attrs }) => {
  label ||= "Disk";
  const usage = Math.round(
    ((data.totalSpace.bytes - data.availableSpace.bytes) /
      data.totalSpace.bytes) *
      100,
  );
  const name = data.name || data.mountPoint;
  const tooltip = `${label}: ${name} ${data.isRemovable ? "(removable)" : ""}; usage: ${useDataSize(data.availableSpace)}/${useDataSize(data.totalSpace)}; mounted at: ${data.mountPoint}.`;

  return (
    <MenuItem
      className="disk"
      disabled
      tooltip={tooltip}
      aria-label={label}
      {...attrs}
    >
      <Status path="relics/data_disk">{usage}%</Status>
    </MenuItem>
  );
};

export default Disk;
