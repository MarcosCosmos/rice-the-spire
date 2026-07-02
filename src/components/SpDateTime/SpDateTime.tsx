import SpOutlinedText from "../SpOutlinedText";
import "./SpDateTime.css";
import SpIcon from "../SpIcon";
import { useEffect, useState } from "react";
import SpTooltip from "../SpTooltip";
import SpNote from "../SpNote";
import { useSizeForExpectedText } from "../../util/useSizeForExpectedText";
// timeStyle: "short",
// hour12: false,
const defaultShortDateFormat = new Intl.DateTimeFormat(undefined, {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
});
const defaultShortTimeFormat = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const defaultLongFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "full",
  timeStyle: "long",
});

const expectedTimeSamples = [
  new Date(9000, 9, 9, 0, 0, 0),
  new Date(9000, 9, 9, 12, 50, 50),
  new Date(9000, 9, 9, 23, 0, 0),
  new Date(9000, 9, 9, 23, 50, 50),
  new Date(9000, 11, 30, 12, 0, 0),
  new Date(9000, 11, 30, 12, 50, 50),
  new Date(9000, 11, 30, 23, 50, 50),
  new Date(9000, 11, 30, 23, 0, 0),
];
export interface SpDateTimeProps {
  className?: string;

  /**
   * Used in the main display. Defaults to short 2-digit with 24-hour time because it's most game-esque.
   */
  shortDateFormat?: Intl.DateTimeFormat;
  shortTimeFormat?: Intl.DateTimeFormat;

  /**
   * Used in the tooltip. Defaults to "full" date and "long" time (usually everything but the timezone)
   */
  longFormat?: Intl.DateTimeFormat;
}

export const SpDateTime = ({
  className,
  shortDateFormat,
  shortTimeFormat,
  longFormat,
}: SpDateTimeProps) => {
  className ??= "";
  shortDateFormat ??= defaultShortDateFormat;
  shortTimeFormat ??= defaultShortTimeFormat;
  longFormat ??= defaultLongFormat;

  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 100);
    return () => {
      clearInterval(interval);
    };
  });

  const [samples, setSamples] = useState<string[]>([]);
  useEffect(() => {
    const newSamples = expectedTimeSamples.map(
      (x) => `${shortDateFormat.format(x)} ${shortTimeFormat.format(x)}`,
    );
    setSamples(newSamples);
  }, [shortDateFormat, shortTimeFormat]);

  const label = "Datetime";

  const textAttrs = useSizeForExpectedText(samples);

  // TODO: this needs an assumed width
  return (
    <SpTooltip
      anchor={(id) => (
        <SpNote
          className={`sp-datetime ${className}`}
          aria-label={label}
          aria-describedby={id}
        >
          <SpIcon path="ui/top_bar/timer_icon" />
          <SpOutlinedText aria-hidden="true" {...textAttrs}>
            {shortDateFormat.format(now)} {shortTimeFormat.format(now)}
          </SpOutlinedText>
        </SpNote>
      )}
      desc={
        <>
          <h2>Date and time: </h2> {longFormat.format(now)}
        </>
      }
    />
  );
};
