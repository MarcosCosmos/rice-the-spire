import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import Disk from "../Disk";

const FullestDisk = () => {
  const zebar = useContext(ZebarContext);

  if (zebar?.disk?.disks.length > 0) {
    const fullest = zebar.disk.disks
      .map((disk) => ({
        ...disk,
        usage: Math.round(
          ((disk.totalSpace.bytes - disk.availableSpace.bytes) /
            disk.totalSpace.bytes) *
            100,
        ),
      }))
      .sort((a, b) => a.usage - b.usage)[0];

    return <Disk data={fullest} label="Fullest disk" />;
  }

  return null;
};

export default FullestDisk;
