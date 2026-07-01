import {
  useState,
  useEffect,
  useContext,
  useRef,
  type CSSProperties,
} from "react";
import { resolveSpireImage, useSizeForExpectedText } from "../../util";
import { ZebarContext, type BannerColor } from "../../contexts";
import { Plaque } from "./Plaque";
import "./MediaProgress.css";

export interface ProgressMarkerProps {
  className?: string;
  color: BannerColor;
}

const prefersReducedMotion = matchMedia("prefers-reduced-motion");
const energyIconPath = resolveSpireImage("ui/energy/colorless_energy_icon");
const animatedFlamePath = resolveSpireImage(
  "card-frames/ancient_flame",
  "webp",
);

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

export const MediaProgress = ({ className, color }: ProgressMarkerProps) => {
  className ??= "";
  const zebar = useContext(ZebarContext);
  const currentSession = zebar?.media?.currentSession;
  const [position, setPosition] = useState(currentSession?.startTime ?? 0);
  const intervalId = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (currentSession?.isPlaying) {
      let counter = currentSession.position;
      if (!intervalId.current || Math.abs(position - counter) > 1) {
        clearInterval(intervalId.current);
        setPosition(counter);
        intervalId.current = setInterval(() => {
          counter += 1;
          setPosition(Math.max(counter, 0));
        }, 1000);
        return () => {
          clearInterval(intervalId.current);
          intervalId.current = undefined;
        };
      }
    } else if (intervalId.current) {
      clearInterval(intervalId.current);
    }
  }, [
    currentSession?.isPlaying,
    currentSession?.position,
    currentSession?.sessionId,
    currentSession?.trackNumber,
  ]);

  const [longTimeString, setLongTimeString] = useState<string>("00:00");
  const elapsedStyle = useSizeForExpectedText(
    longTimeString,
    "400 0.9rem Kreon",
    "2 * var(--inline-padding)",
  );

  const [stillFlame, setStillFlame] = useState<string>(energyIconPath);

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

  const [flameExcessHeightRatio, setFlameExcessHeightRatio] =
    useState<number>(0);
  useEffect(() => {
    const img = new Image();
    // weirdly this one image needs CORS
    img.setAttribute("crossOrigin", "anonymous");
    img.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      setFlameExcessHeightRatio(
        Math.max(0, (img.height - img.width) / img.width),
      );

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            console.log("success", url);
            setStillFlame(url);
          }
        },
        "image/webp",
        1,
      );
    });
    img.addEventListener("error", (e) => {
      console.error(e);
    });

    img.src = animatedFlamePath + "?queryForCORS";
  }, []);

  // use media query from JS to lock to the png for prefers reduced motion, as well as when paused
  const [animate, setAnimate] = useState<boolean>(false);
  useEffect(() => {
    setAnimate(!!currentSession?.isPlaying && !reduceMotion);
  }, [!!currentSession?.isPlaying, reduceMotion]);

  if (currentSession) {
    const newString = formatDuration(currentSession.endTime).replace(
      /[1-9]/g,
      "0",
    );
    if (newString !== longTimeString) {
      setLongTimeString(newString);
    }

    const ellapsedTime = formatDuration(position);
    const totalTime = formatDuration(currentSession.endTime);
    const progress =
      (position - currentSession.startTime) /
      (currentSession.endTime - currentSession.startTime);

    const markerStyle: CSSProperties = {
      "--song-progress": progress.toString(),
      "--marker-height-ratio": reduceMotion ? 0 : flameExcessHeightRatio,
    } as CSSProperties;

    const markerUrl = reduceMotion
      ? energyIconPath
      : animate
        ? animatedFlamePath
        : stillFlame;
    return (
      <div className={`media-progress ${className}`}>
        <Plaque color={color}>
          <div className="media-progress__elapsed" style={elapsedStyle}>
            {ellapsedTime}
          </div>
        </Plaque>
        <div
          className="media-progress__timeline"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress * 100}
          aria-valuetext={`${(progress * 100).toFixed(0)}% (${formatDuration(currentSession.endTime - currentSession.position)} remaining)`}
        >
          <Plaque className="media-progress__timeline-line" color={color} />

          <img
            aria-hidden="true"
            className="media-progress__marker"
            style={markerStyle}
            src={markerUrl}
          />
        </div>
        <Plaque color={color}>
          <div className="media-progress__song-length">{totalTime}</div>
        </Plaque>
      </div>
    );
  }
};
