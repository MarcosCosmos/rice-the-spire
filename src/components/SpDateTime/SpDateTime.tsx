import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpStatus from "../SpStatus";
import SpOutlinedText from "../SpOutlinedText";
import SpBar from "../SpBar";

const shortDateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
});
const shortTimeFormat = new Intl.DateTimeFormat(undefined, {
  timeStyle: "short",
});
const longFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
  timeStyle: "long",
});

const SpDateTime = () => {
  const zebar = useContext(ZebarContext);
  const date = zebar?.date || { now: Date.now() };
  const label = "Date and time";

  return (
    <SpBar>
      <SpMenuItem
        className="datetime"
        aria-label={`${label}`}
        disabled
        tooltip={`${label}: ${longFormat.format(date.now)}`}
      >
        <SpStatus className="date" path="ui/top_bar/timer_icon" />
        <SpOutlinedText>
          {shortDateFormat.format(date.now)} {shortTimeFormat.format(date.now)}
        </SpOutlinedText>
      </SpMenuItem>
    </SpBar>
  );
};

export default SpDateTime;
