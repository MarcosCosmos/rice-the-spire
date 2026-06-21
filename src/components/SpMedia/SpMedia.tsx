import { useContext, useEffect, useState, type CSSProperties } from "react";
import { SpireContext, ZebarContext } from "../../contexts";
import SpSpireImage from "../SpSpireImage";
import "./SpMedia.css";
import SpTooltip from "../SpTooltip";
import { SpButton } from "../SpButton/SpButton";

const durationFormat = new Intl.DurationFormat(undefined, {
  style: "digital",
  hoursDisplay: "auto",
});
const formatDuration = (timeInSeconds: number): string => {
  const isNegative = timeInSeconds < 0;
  if (isNegative) {
    timeInSeconds = Math.abs(timeInSeconds);
  }
  const hours = Math.floor(timeInSeconds / 60 / 60);
  const minutes = Math.floor((timeInSeconds - hours * 60 * 60) / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  const result = durationFormat.format({ hours, minutes, seconds });
  return `${isNegative ? "-" : ""}${result}`;
};

export interface SpMediaProps {
  className?: string;
}

export const SpMedia = ({ className }: SpMediaProps) => {
  className ??= "";
  const zebar = useContext(ZebarContext);
  const spire = useContext(SpireContext);
  const currentSession = zebar?.media?.currentSession;
  const [position, setPosition] = useState(currentSession?.endTime ?? 0);

  const [intervalId, setIntervalId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (currentSession?.isPlaying) {
      let counter = currentSession.position;
      if (!intervalId || Math.abs(position - counter) > 1) {
        clearInterval(intervalId);
        setPosition(counter);
        setIntervalId(
          setInterval(() => {
            counter += 1;
            setPosition(Math.max(counter, 0));
          }, 1000),
        );
      }
    } else {
      clearInterval(intervalId);
    }
  }, [
    currentSession?.position,
    currentSession?.isPlaying,
    currentSession?.sessionId,
    currentSession?.trackNumber,
  ]);

  if (currentSession) {
    const title = currentSession.title ?? "No Title";
    const artist = currentSession.artist ?? "Unknown Artist";
    const ellapsedTime = formatDuration(position);
    const totalTime = formatDuration(currentSession.endTime);
    const progressPercent =
      (position - currentSession.startTime) /
      (currentSession.endTime - currentSession.startTime);
    const style: CSSProperties = {
      "--song-progress": progressPercent.toString(),
      "--duration-width": `${totalTime.length.toFixed(0)}ch`,
    } as CSSProperties;

    const onPrevious = () => {
      zebar.media?.previous({ sessionId: currentSession.sessionId });
    };
    const onToggle = () => {
      if (currentSession.isPlaying) {
        zebar.media?.pause({ sessionId: currentSession.sessionId });
      } else {
        zebar.media?.next({ sessionId: currentSession.sessionId });
      }
    };

    const onNext = () => {
      zebar.media?.next({ sessionId: currentSession.sessionId });
    };

    // todo: this needs improved accessibility that I haven't quite figured out yet; might have to refer to some examples!
    // toolbar is probably not quite right

    return (
      <div
        className={`media anchor-tooltips-block-start ${className}`}
        role="toolbar"
        aria-label="Media Player"
      >
        <SpTooltip
          className="media__track-info-wrapper"
          anchor={(tooltipId: string) => (
            <div className="media__track-info" aria-describedby={tooltipId}>
              <div className="media__track-title">{title}</div>
              <div className="media__track-artist">{artist}</div>
            </div>
          )}
          desc={
            <>
              <strong>{title}</strong> by <strong>{artist}</strong> on album{" "}
              <strong>{currentSession.albumTitle}</strong> via session{" "}
              <em>{currentSession.sessionId}</em>
            </>
          }
        />
        <div className="media__progress" style={style}>
          <div className="media__duration">{ellapsedTime}</div>
          <div className="media__timeline">
            <div className="media__timeline-line" />
            <SpSpireImage
              className="media__time-marker"
              path={`ui/energy/${spire.character}_energy_icon`}
            />
          </div>
          <div className="media__duration">{totalTime}</div>
        </div>
        <div className="media__controls">
          <SpButton className="media__previous" onClick={onPrevious}>
            ⏮
          </SpButton>
          <SpButton className="media__toggle-play" onClick={onToggle}>
            {currentSession.isPlaying ? "⏸" : "⏵"}
          </SpButton>
          <SpButton className="media__next" onClick={onNext}>
            ⏭
          </SpButton>
        </div>
      </div>
    );
  }
};
