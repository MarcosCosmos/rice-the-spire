import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpStatus from "../SpStatus";
import SpSpireImage from "../SpSpireImage";

const Audio = ({ ...attrs }) => {
  const zebar = useContext(ZebarContext);
  const device = zebar?.audio?.defaultPlaybackDevice || {
    volume: 0,
    isMuted: true,
  };
  const displayVolume = `${device.volume}%`;
  const desc = `Volume: ${displayVolume}${device.isMuted ? " (muted)" : ""}; audio device: ${device.name}.`;
  const onClick = () =>
    zebar?.audio?.setMute(!device.isMuted, { deviceId: device.deviceId });
  const onWheel = (event) => {
    const newVolume = Math.max(
      0,
      Math.min(100, device.volume + (event.deltaY < 0 ? 2 : -2)),
    );
    if (newVolume !== device.volume) {
      zebar?.audio?.setVolume(newVolume, { deviceId: device.deviceId });
    }
  };

  return (
    <SpMenuItem
      className="volume"
      tooltip={desc}
      onClick={onClick}
      aria-label="Volume"
      onWheel={onWheel}
      {...attrs}
    >
      <SpStatus path="powers/ringing">{displayVolume}</SpStatus>
      {device.isMuted && (
        <SpSpireImage
          className="audio__muted-mark"
          path="powers/well_laid_plans"
        />
      )}
    </SpMenuItem>
  );
};

export default Audio;
