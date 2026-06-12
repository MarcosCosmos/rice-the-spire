import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import MenuItem from "../MenuItem";
import Status from "../Status";

const weatherMap = {
  clear_day: "radiance",
  clear_night: "black_hole",
  cloudy: "blur",
  light_rain: "friendship",
  heavy_rain: "slippery",
  snow: "hailstorm",
  thunder: "storm",
};

const Weather = ({ ...attrs }) => {
  const zebar = useContext(ZebarContext);
  const data = zebar?.weather ?? {
    status: "clear_day",
    celsiusTemp: "?",
  };
  const cleanStatus = data.status.replace(/_/g, " ");
  const displayTemp = `${Math.round(data.celsiusTemp)}°C`;
  const description = `Weather: ${cleanStatus} ${displayTemp}`;

  let simplifiedStatus;
  switch (data.status) {
    case "clear_day":
    case "clear_night":
      simplifiedStatus = data.status;
      break;
    case "cloudy_day":
    case "cloudy_night":
      simplifiedStatus = "cloudy";
      break;
    case "light_rain_day":
    case "light_rain_night":
      simplifiedStatus = "light_rain";
      break;
    case "heavy_rain_day":
    case "heavy_rain_night":
      simplifiedStatus = "heavy_rain";
      break;
    case "snow_day":
    case "snow_night":
      simplifiedStatus = "snow";
      break;
    case "thunder_day":
    case "thunder_night":
      simplifiedStatus = "thunder";
      break;
    default:
      simplifiedStatus = "clear";
  }

  return (
    <MenuItem
      disabled
      className={`weather weather--${simplifiedStatus}`}
      aria-label="Weather"
      tooltip={description}
      {...attrs}
    >
      <Status path={`powers/${weatherMap[simplifiedStatus]}`}>
        {displayTemp}
      </Status>
    </MenuItem>
  );
};

export default Weather;
