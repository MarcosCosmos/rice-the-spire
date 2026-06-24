import SpOutlinedText from "../SpOutlinedText";
import "./SpDateTime.css";
import SpSpireImage from "../SpSpireImage";
import { useEffect, useState, type CSSProperties } from "react";
import SpTooltip from "../SpTooltip";
import SpNote from "../SpNote";
import { measureTextWidth } from "../../util/measureText";

const shortDateFormat = new Intl.DateTimeFormat(undefined, {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
});
const shortTimeFormat = new Intl.DateTimeFormat(undefined, {
  timeStyle: "short",
  hour12: false,
});
const longFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "full",
  timeStyle: "long",
});
export interface SpDateTimeProps {
  className?: string;
}

const assumedText = {
  text: "00/00/00 00:00",
  font: "400 1.5rem Kreon",
};

export const SpDateTime = ({ className }: SpDateTimeProps) => {
  className ??= "";
  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 100);
    return () => {
      clearInterval(interval);
    };
  });
  const label = "Datetime";

  const [preWidth, setPreWidth] = useState<number | undefined>(undefined);
  useEffect(() => {
    setPreWidth(measureTextWidth(assumedText.text, assumedText.font));
  }, []);
  const style: CSSProperties = {
    minWidth: preWidth,
  };

  // TODO: this needs an assumed width
  return (
    <SpTooltip
      anchor={(id) => (
        <SpNote
          className={`datetime {className}`}
          aria-label={label}
          aria-describedby={id}
          style={style}
        >
          <SpSpireImage className="date" path="ui/top_bar/timer_icon" />
          <SpOutlinedText aria-hidden="true">
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
