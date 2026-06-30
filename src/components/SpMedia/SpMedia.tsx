import { useContext, useEffect, useState, type CSSProperties } from "react";
import {
  type BannerColor,
  SpireContext,
  useNavigationGroup,
  ZebarContext,
} from "../../contexts";
import SpSpireImage from "../SpSpireImage";
import "./SpMedia.css";
import { SpButton } from "../SpButton/SpButton";
import SpNote from "../SpNote";
import SpOutlinedText from "../SpOutlinedText";
import { Plaque } from "./Plaque";
import SpTooltip from "../SpTooltip";
import { useSizeForExpectedText } from "../../util";

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

const prefersReducedMotion = matchMedia("prefers-reduced-motion");

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

  const [longTimeString, setLongTimeString] = useState<string>("00:00");
  if (currentSession) {
    const newString = formatDuration(currentSession.endTime).replace(
      /[1-9]/g,
      "0",
    );
    if (newString !== longTimeString) {
      setLongTimeString(newString);
    }
  }
  const durationWidth = useSizeForExpectedText(
    longTimeString,
    "400 .9rem Kreon",
  );

  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  // watch effect in case prefers reduced motion changes
  useEffect(() => {
    setReduceMotion(prefersReducedMotion.matches);
    const listener = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches);
    };
    prefersReducedMotion.addEventListener("change", listener);
    return () => {
      prefersReducedMotion.removeEventListener("change", listener);
    };
  }, []);

  // use media query from JS to lock to the png for prefers reduced motion, as well as when paused
  const [showFlame, setShowFlame] = useState<boolean>(false);
  useEffect(() => {
    setShowFlame(!reduceMotion);
  }, [reduceMotion]);

  const [bannerColor, setBannerColor] = useState<BannerColor>("common");
  useEffect(() => {
    setBannerColor(
      spire.bannerColors[Math.floor(Math.random() * spire.bannerColors.length)],
    );
  }, [currentSession?.sessionId, currentSession?.trackNumber]);

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
      "--min-duration-width": durationWidth.minWidth,
    } as CSSProperties;

    const onPrevious = () => {
      zebar.media?.previous({ sessionId: currentSession.sessionId });
    };
    const onToggle = () => {
      if (currentSession.isPlaying) {
        zebar.media?.pause({ sessionId: currentSession.sessionId });
      } else {
        zebar.media?.play({ sessionId: currentSession.sessionId });
      }
    };

    const onNext = () => {
      zebar.media?.next({ sessionId: currentSession.sessionId });
    };

    // todo: this needs improved accessibility that I haven't quite figured out yet; might have to refer to some examples!
    // toolbar is probably not quite right

    return (
      <div
        className={`media media--${showFlame ? "flame" : "energy"} media--banner-${bannerColor} anchor-tooltips-block-end ${className}`}
        role="complementary"
        aria-label="Media Player"
        {...navAttrs}
      >
        <SpSpireImage
          className="media__background"
          path={`card-frames/banner_${bannerColor}`}
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
            <Plaque color={bannerColor}>
              <div className="media__elapsed">{ellapsedTime}</div>
            </Plaque>
            <div className="media__timeline">
              <Plaque className="media__timeline-line" color={bannerColor} />

              <SpSpireImage
                className="media__time-marker"
                path={
                  showFlame
                    ? "card-frames/ancient_flame"
                    : `ui/energy/${spire.character}_energy_icon`
                }
              />
            </div>
            <Plaque color={bannerColor}>
              <div className="media__song-length">{totalTime}</div>
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
