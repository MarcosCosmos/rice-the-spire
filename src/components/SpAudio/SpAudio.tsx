import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";
import "./SpAudio.css";
import type { AudioDevice } from "zebar";
import SpCrossout from "../SpCrossout";

const Audio = () => {
  const zebar = useContext(ZebarContext);
  const device: Partial<AudioDevice> = zebar?.audio?.defaultPlaybackDevice || {
    volume: 0,
    isMuted: true,
  };
  const displayVolume = `${device.volume}%`;
  const label = "Volume";
  const tooltip = (
    <>
      <h2>{label}: </h2>
      <strong>{displayVolume}</strong>
      {device.isMuted && " (muted)"}
      <h2>Audio device: </h2>
      {device.name}
    </>
  );
  const onClick = () =>
    zebar?.audio?.setMute(!device.isMuted, { deviceId: device.deviceId });
  const onWheel = (event: MouseEvent & any) => {
    const newVolume = Math.max(
      0,
      Math.min(100, device.volume! + (event.deltaY < 0 ? 2 : -2)),
    );
    if (newVolume !== device.volume) {
      zebar?.audio?.setVolume(newVolume, { deviceId: device.deviceId });
    }
  };

  return (
    <SpMenuItem
      className="volume"
      tooltip={tooltip}
      onClick={onClick}
      aria-label={label}
      onWheel={onWheel}
    >
      <SpPower path="powers/ringing">{displayVolume}</SpPower>
      {device.isMuted && <SpCrossout />}
    </SpMenuItem>
  );
};

export default Audio;
