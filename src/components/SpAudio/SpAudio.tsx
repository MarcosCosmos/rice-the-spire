import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";
import SpSpireImage from "../SpSpireImage";
import "./SpAudio.css";
import type { AudioDevice } from "zebar";
import { SpNum } from "../SpTooltip";

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
      <h1>{label}: </h1>
      <SpNum>{displayVolume}</SpNum>
      {device.isMuted && " (muted)"}
      <h1>Audio device: </h1>
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
