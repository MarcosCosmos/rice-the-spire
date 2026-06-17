import SpMenuItem from "../SpMenuItem";
import SpOutlinedText from "../SpOutlinedText";
import "./SpDateTime.css";
import SpSpireImage from "../SpSpireImage";

const shortDateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
});
const shortTimeFormat = new Intl.DateTimeFormat(undefined, {
  timeStyle: "short",
});
const longFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "full",
  timeStyle: "long",
});

export const SpDateTime = () => {
  const now = Date.now();
  const label = "Datetime";
  const tooltip = (
    <>
      <h2>Date and time: </h2>
      {longFormat.format(now)}
    </>
  );

  return (
    <SpMenuItem
      className="datetime"
      disabled
      aria-label={label}
      tooltip={tooltip}
    >
      <SpSpireImage className="date" path="ui/top_bar/timer_icon" />
      <SpOutlinedText aria-hidden="true">
        {shortDateFormat.format(now)} {shortTimeFormat.format(now)}
      </SpOutlinedText>
    </SpMenuItem>
  );
};
