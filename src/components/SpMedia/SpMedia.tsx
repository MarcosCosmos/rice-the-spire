import { useContext, useEffect, useState, type CSSProperties } from "react";
import { SpireContext, useNavigationGroup, ZebarContext } from "../../contexts";
import SpSpireImage from "../SpSpireImage";
import "./SpMedia.css";
import { SpButton } from "../SpButton/SpButton";
import SpNote from "../SpNote";
import SpOutlinedText from "../SpOutlinedText";
import { Plaque } from "./Plaque";
import SpTooltip from "../SpTooltip";

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
  const navAttrs = useNavigationGroup();
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
        className={`media anchor-tooltips-block-end ${className}`}
        role="complementary"
        aria-label="Media Player"
        {...navAttrs}
      >
        <SpSpireImage
          className="media__background"
          path="ui/compendium/card/card_banner"
        />
        <div className="media__content">
          <div className="media__track-info">
            <SpTooltip
              anchor={(tooltipId: string) => (
                <SpNote aria-describedby={tooltipId}>
                  <SpOutlinedText>
                    <span>{title}</span> · <span>{artist}</span>
                  </SpOutlinedText>
                </SpNote>
              )}
              desc={
                <>
                  <strong>{title}</strong> by <strong>{artist}</strong> on album{" "}
                  <strong>{currentSession.albumTitle}</strong>
                  {/* <br />
                  via session <strong>{currentSession.sessionId}</strong>
                  <br />
                  Progress: <em>{ellapsedTime}</em> out of{" "} 
                  <strong>{totalTime}</strong>*/}
                </>
              }
            />
          </div>
          <div className="media__progress" style={style}>
            <Plaque>
              <div className="media__duration">{ellapsedTime}</div>
            </Plaque>
            <div className="media__timeline">
              <div className="media__timeline-line" />
              <SpSpireImage
                className="media__time-marker"
                path={`ui/energy/${spire.character}_energy_icon`}
              />
            </div>
            <Plaque>
              <div className="media__duration">{totalTime}</div>
            </Plaque>
          </div>
          <div className="media__controls">
            <SpButton className="media__previous" onClick={onPrevious}>
              <SpOutlinedText>⏮</SpOutlinedText>
            </SpButton>
            <SpButton className="media__toggle-play" onClick={onToggle}>
              <SpOutlinedText>
                {currentSession.isPlaying ? "⏸" : "⏵"}
              </SpOutlinedText>
            </SpButton>
            <SpButton className="media__next" onClick={onNext}>
              <SpOutlinedText>⏭</SpOutlinedText>
            </SpButton>
          </div>
        </div>
      </div>
    );
  }
};
