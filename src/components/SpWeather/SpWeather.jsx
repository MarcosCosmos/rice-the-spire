import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpStatus from "../SpStatus";

const weatherMap = {
  clear_day: "radiance",
  clear_night: "black_hole",
  cloudy: "blur",
  light_rain: "friendship",
  heavy_rain: "slippery",
  snow: "hailstorm",
  thunder: "storm",
};

const SpWeather = ({ ...attrs }) => {
  const zebar = useContext(ZebarContext);
  const data = zebar?.weather ?? {
    status: "clear_day",
    celsiusTemp: "?",
  };
  const cleanSpStatus = data.status.replace(/_/g, " ");
  const displayTemp = `${Math.round(data.celsiusTemp)}°C`;
  const description = `SpWeather: ${cleanSpStatus} ${displayTemp}`;

  let simplifiedSpStatus;
  switch (data.status) {
    case "clear_day":
    case "clear_night":
      simplifiedSpStatus = data.status;
      break;
    case "cloudy_day":
    case "cloudy_night":
      simplifiedSpStatus = "cloudy";
      break;
    case "light_rain_day":
    case "light_rain_night":
      simplifiedSpStatus = "light_rain";
      break;
    case "heavy_rain_day":
    case "heavy_rain_night":
      simplifiedSpStatus = "heavy_rain";
      break;
    case "snow_day":
    case "snow_night":
      simplifiedSpStatus = "snow";
      break;
    case "thunder_day":
    case "thunder_night":
      simplifiedSpStatus = "thunder";
      break;
    default:
      simplifiedSpStatus = "clear";
  }

  return (
    <SpMenuItem
      disabled
      className={`weather weather--${simplifiedSpStatus}`}
      aria-label="SpWeather"
      tooltip={description}
      {...attrs}
    >
      <SpStatus path={`powers/${weatherMap[simplifiedSpStatus]}`}>
        {displayTemp}
      </SpStatus>
    </SpMenuItem>
  );
};

export default SpWeather;
