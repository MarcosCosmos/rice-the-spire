import {
  useState,
  useEffect,
  useContext,
  useRef,
  type CSSProperties,
} from "react";
import { resolveSpireImage, useSizeForExpectedText } from "../../util";
import { ZebarContext, type BannerColor } from "../../contexts";
import { SpPlaque } from "./SpPlaque";
import "./SpMediaProgress.css";

export interface ProgressMarkerProps {
  className?: string;
  color: BannerColor;
}

const prefersReducedMotion = matchMedia("(prefers-reduced-motion)");
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

export const SpMediaProgress = ({ className, color }: ProgressMarkerProps) => {
  className ??= "";
  const zebar = useContext(ZebarContext);
  const currentSession = zebar?.media?.currentSession;
  const [position, setPosition] = useState(currentSession?.startTime ?? 0);
  const intervalId = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (currentSession?.isPlaying) {
      let counter = currentSession.position;
      if (
        !intervalId.current ||
        Math.abs(currentSession.position - counter) > 1
      ) {
        clearInterval(intervalId.current);
        setPosition(counter);
        intervalId.current = setInterval(() => {
          counter = Math.max(0, Math.min(currentSession.endTime, counter + 1));
          setPosition(counter);
          if (counter === currentSession.endTime) {
            clearInterval(intervalId.current);
            intervalId.current = undefined;
          }
        }, 1000);
        return () => {
          clearInterval(intervalId.current);
          intervalId.current = undefined;
        };
      }
    } else if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = undefined;
    }
  }, [
    currentSession?.isPlaying,
    currentSession?.position,
    currentSession?.sessionId,
    currentSession?.trackNumber,
  ]);

  const [longTimeString, setLongTimeString] = useState<string>("00:00");
  const elapsedAttrs = useSizeForExpectedText(longTimeString);

  const [stillFlame, setStillFlame] = useState<string | undefined>(undefined);

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

    // honestly the query string probably shouldn't work but apparently it does.
    // making it non-random to continue benefiting from zebar cache
    img.src = animatedFlamePath + "?queryForCORS";
  }, []);

  // use media query from JS to lock to the png for prefers reduced motion, as well as when paused
  const [animate, setAnimate] = useState<boolean>(false);
  useEffect(() => {
    setAnimate(!reduceMotion && !!stillFlame);
  }, [reduceMotion, stillFlame]);

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
    const progress = Math.max(
      0,
      Math.min(
        1,
        (position - currentSession.startTime) /
          (currentSession.endTime - currentSession.startTime),
      ),
    );

    const markerStyle: CSSProperties = {
      "--song-progress": progress.toString(),
      "--marker-height-ratio": animate ? flameExcessHeightRatio : 0,
    } as CSSProperties;

    const markerUrl = animate
      ? currentSession.isPlaying
        ? animatedFlamePath
        : stillFlame
      : energyIconPath;
    return (
      <div className={`sp-media-progress ${className}`}>
        <SpPlaque color={color}>
          <div className="sp-media-progress__elapsed" {...elapsedAttrs}>
            {ellapsedTime}
          </div>
        </SpPlaque>
        <div
          className="sp-media-progress__timeline"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress * 100}
          aria-valuetext={`${(progress * 100).toFixed(0)}% (${formatDuration(currentSession.endTime - currentSession.position)} remaining)`}
        >
          <SpPlaque className="sp-media-progress__rail" color={color} />

          <img
            aria-hidden="true"
            className="sp-media-progress__marker"
            style={markerStyle}
            src={markerUrl}
          />
        </div>
        <SpPlaque color={color}>
          <div className="sp-media-progress__song-length">{totalTime}</div>
        </SpPlaque>
      </div>
    );
  }
};
