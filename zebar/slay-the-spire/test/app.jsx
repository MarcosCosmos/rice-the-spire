import React, {
  useState,
  useEffect,
} from 'https://esm.sh/react@18?dev';
import { createRoot } from 'https://esm.sh/react-dom@18/client?dev';
import * as zebar from 'https://esm.sh/zebar@3.0';
const providers = zebar.createProviderGroup({
  glazewm: { type: 'glazewm' },
  date: { type: 'date', formatting: 'EEE, MMM yyyy d, h:mm a' },
  cpu: { type: 'cpu' },
  battery: { type: 'battery' },
  memory: { type: 'memory' },
  weather: { type: 'weather' },
  media: { type: 'media' },
  audio: { type: 'audio' },
});

const App = () => {
  const [output, setOutput] = useState(providers.outputMap);

  useEffect(() => {
    providers.onOutput(() => setOutput(providers.outputMap));
  }, []);

  console.log(output);

  return (
    <div className="app">
      <Bar><Workspaces workspaces={output.glazewm?.currentWorkspaces}></Workspaces></Bar>
      <Bar>{output.date?.formatted}</Bar>
      <Bar>
        <Battery info={output.battery}></Battery>
        <Weather info={output.weather}></Weather>
      </Bar>
    </div>
  );
}

const Bar = ({children}) => (
  <div className="bar">
    {children}
  </div>
);

const Workspaces = ({ workspaces }) => workspaces?.map(Workspace);

const Workspace = ({ name, displayName, hasFocus, isDisplayed, children }) => {
  const style = 'glass';
  const isEmpty = !children || children.length === 0;
  return (
    <div key={name} className={`workspace workspace--${style} ${hasFocus && 'workspace--focused'} ${isDisplayed && 'workspace--displayed'} ${isEmpty && 'workspace--empty'}`}>
      {displayName || name}
    </div>
  );
};

const Battery = ({ info }) => {
  info = info || {
    state: 'unknown',
    chargePercent: 0,
  };
  const state = info.state;
  if (state !== 'unknown') {
    const value = state === 'unknown' || state === 'full' ? '' : Math.min(99, info?.chargePercent || 0);
    return (
      <div className={`battery battery--${state}`}>
        <div className="battery__inner">
          {value}
        </div>
      </div>
    );
  }
};

const weatherMap = {
  clear_day: '2048 2560 256 256', // radiance https://www.spireology.com/powers/RADIANCE_POWER
  clear_night: '4096 0 256 256', // https://www.spireology.com/powers/BLACK_HOLE_POWER
  cloudy: '0 2304 256 256', // noxious fumes https://www.spireology.com/powers/NOXIOUS_FUMES_POWER
  light_rain: '2304 1280 256 256', // https://www.spireology.com/powers/FRIENDSHIP_POWER
  heavy_rain: '2560 3328 256 256', // https://www.spireology.com/powers/STORM_POWER
  snow: '256 1536 256 256', // https://www.spireology.com/powers/HAILSTORM_POWER
  thunder: '4096 3584 256 256', // https://www.spireology.com/powers/THUNDER_POWER
}
const Weather = ({info}) => {
  let state;
  let status = info?.status || 'clear_day';
  switch (status) {
    case 'clear_day':
    case 'clear_night':
      state = status;
      break;
    case 'cloudy_day':
    case 'cloudy_night':
      state = 'cloudy';
      break;
    case 'light_rain_day':
    case 'light_rain_night':
      state = 'light_rain';
      break;
    case 'heavy_rain_day':
    case 'heavy_rain_night':
      state = 'heavy_rain';
      break;
    case 'snow_day':
    case 'snow_night':
      state = 'snow';
      break;
    case 'thunder_day':
    case 'thunder_night':
      state = 'thunder';
      break;
    default:
      state = 'clear';
  }
  const state_viewbox = weatherMap[state];
  const temp = Math.round(info?.celsiusTemp || 0);
  return (
    <div className={`weather weather--${state}`}>
      <svg className="weather__icon" viewBox={state_viewbox} preserveAspectRatio="xMidYMid meet" alt={state.replace('_', ' ')}>
        <image href="https://www.spireology.com/v0.103.2/assets/sprites/powers.webp" preserveAspectRatio="none"></image>
      </svg>
      <span>{temp}°C</span>
    </div>
  );
};

createRoot(document.getElementById('root')).render(<App />);