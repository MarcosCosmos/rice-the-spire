import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";
import type { WeatherOutput, WeatherStatus } from "zebar";

const weatherMap = {
  clear_day: "radiance",
  clear_night: "black_hole",
  cloudy: "blur",
  light_rain: "friendship",
  heavy_rain: "slippery",
  snow: "hailstorm",
  thunder: "storm",
  unknown: "child_of_the_stars",
};

const SpWeather = ({ ...attrs }) => {
  const zebar = useContext(ZebarContext);
  const data: Partial<WeatherOutput> = zebar?.weather ?? {
    status: "unknown" as WeatherStatus,
  };
  const cleanStatus = data.status!.replace(/_/g, " ");
  const displayTemp = zebar?.weather
    ? `${Math.round(data.celsiusTemp!)}°C`
    : "?";
  const label = "Weather";
  const tooltip = (
    <>
      <h2>{label}: </h2>
      {cleanStatus} (<strong>{displayTemp}</strong>)
    </>
  );

  let simplifiedStatus: keyof typeof weatherMap;
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
      simplifiedStatus = "unknown";
  }

  return (
    <SpMenuItem
      disabled
      className={`weather weather--${simplifiedStatus}`}
      aria-label={label}
      tooltip={tooltip}
      {...attrs}
    >
      <SpPower path={`powers/${weatherMap[simplifiedStatus]}`}>
        {displayTemp}
      </SpPower>
    </SpMenuItem>
  );
};

export default SpWeather;
