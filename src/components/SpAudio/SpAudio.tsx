import { useContext, type WheelEvent } from "react";
import ZebarContext from "../../contexts/ZebarContext";
import SpPower from "../SpPower";
import "./SpAudio.css";
import SpTooltip from "../SpTooltip";
import { SpButton } from "../SpButton/SpButton";

const assumedText = { text: "100%", font: "400 12px Kreon" };

export const SpAudio = () => {
  const zebar = useContext(ZebarContext);
  const device = zebar?.audio?.defaultPlaybackDevice ?? {
    volume: 0,
    isMuted: true,
    name: "",
    deviceId: undefined,
  };
  const displayVolume = `${device.volume.toFixed(0)}%`;
  const label = "Volume";
  const onClick = () => {
    void zebar?.audio?.setMute(!device.isMuted, { deviceId: device.deviceId });
  };
  const onWheel = (event: WheelEvent) => {
    const newVolume = Math.max(
      0,
      Math.min(100, device.volume + (event.deltaY < 0 ? 2 : -2)),
    );
    if (newVolume !== device.volume) {
      void zebar?.audio?.setVolume(newVolume, { deviceId: device.deviceId });
    }
  };

  const path = device.isMuted
    ? ["powers/ringing", "powers/well_laid_plans"]
    : "powers/ringing";

  return (
    <SpTooltip
      anchor={(id) => (
        <SpButton
          className="volume"
          onClick={onClick}
          aria-pressed={device.isMuted}
          aria-label={label}
          aria-describedby={id}
          onWheel={onWheel}
        >
          <SpPower path={path} assumedText={assumedText}>
            {displayVolume}
          </SpPower>
        </SpButton>
      )}
      desc={
        <>
          <h2>{label}: </h2>
          <strong>{displayVolume}</strong>
          {device.isMuted && " (muted)"} <h2>Audio device: </h2>
          {device.name}
        </>
      }
    />
  );
};
