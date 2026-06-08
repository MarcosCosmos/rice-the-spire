import React, {
  useState,
  useEffect,
  useId,
  createContext,
  useContext,
} from 'https://esm.sh/react@19.2?dev';
import { createRoot } from 'https://esm.sh/react-dom@19.2/client?dev';
import * as zebar from 'https://esm.sh/zebar@3.0';
const spireologyUrl = 'https://www.spireology.com/v0.103.2/assets/sprites/manifest.json';
const dummyZebar = {
  battery: {
    state: 'discharging',
    chargePercent: 70,
  },
  weather: {
    status: 'light_rain_day',
    celsiusTemp: 20,
  }
};

const useDummy = false;

const Zebar = createContext(null);
const Spireology = createContext(null);

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
  const [output, setOutput] = useState(null);
  const [spireology, setSpireology] = useState(null);

  useEffect(() => {    
    providers.onOutput(() => {
      const result = useDummy ? {...providers.outputMap, ...dummyZebar} : providers.outputMap;
      setOutput(result);
    });
  }, []);

  useEffect(() => {
    (async () => {
      const response = await fetch(spireologyUrl);
      if (response.ok) {
        setSpireology(await response.json());
      } else {
        throw new Error(`Failed to fetch Spireology manifest @ ${spireologyUrl}`);
      }
    })();
  }, []);
  const hasMode = output?.glazewm?.bindingModes.length > 0;
  return (
    <div className={`app ${!hasMode && 'app--no-binding-mode'}`} role="menubar">
      <Zebar value={output}>
          <Spireology value={spireology}>
            <div className="section">
              <Workspaces />
            </div>
            <div className="section">
              <DateTime />
            </div>
            <div className="section">
              <WmControls />
              <Bar className="statuses" aria-label="Statuses">
                <Battery />
                <Audio />
                <Weather />
              </Bar>    
            </div>
          </Spireology>
      </Zebar>
    </div>
  );
}

const Bar = ({className, children, ...fallthrough}) => {
  className = className || '';
  return (
    <div className={`bar ${className}`} role="region" {...fallthrough}>
      <div className="bar__inner">
        {children}
      </div>
    </div>
  );
};

const DateTime = () => {
  const zebar = useContext(Zebar);
  return (
    <Bar aria-label="Date and time">
      <div className="datetime" role="menuitem" aria-disabled="true" tabIndex="0">
        <OutlinedText>{zebar?.date?.formatted}</OutlinedText>
      </div>
    </Bar>
  );
};

const Workspaces = () => {
  const zebar = useContext(Zebar);
  return zebar?.glazewm && (
    <Bar className="workspaces" aria-label={"Workspaces"}>
      { zebar?.glazewm?.currentWorkspaces?.map(Workspace) }
    </Bar>
  );
}

const workspaceStateMap = {
  'focused': 'lightning_orb',
  'displayed': 'plasma_orb',
  'empty': 'empty_slot',
  'full_a': 'glass_orb',
  'full_b': 'frost_orb',
  'full_c': 'dark_orb'
};
const Workspace = ({ name, displayName, hasFocus, isDisplayed, children }) => {
  const zebar = useContext(Zebar);
  let style;
  const isEmpty = !children || children.length === 0;
  if (hasFocus) {
    style = 'focused';
  } else if (isDisplayed) {
    style = 'displayed';
  } else if (isEmpty) {
    style = 'empty';
  } else {
    style = 'full_b';
  }
  const path = workspaceStateMap[style];
  displayName = displayName || name;
  const workspaceDesc = `Workspace: ${displayName}; empty: ${isEmpty}; focused: ${hasFocus}; displayed: ${isDisplayed}.`;
  const onClick = () => zebar.glazewm.runCommand(`focus --workspace ${name}`);
  return (
    <Status
      key={name}
      className={`workspace workspace--${style} ${hasFocus && 'workspace--focused'} ${isDisplayed && 'workspace--displayed'} ${isEmpty && 'workspace--empty'}`}
      path={`orb/${path}`}
      desc={workspaceDesc}
      onClick={onClick}
      label={displayName || name}
    />
  );
};

const WmControls = () => {
  const zebar = useContext(Zebar);
  return zebar?.glazewm && (
    <Bar className="wm-controls" aria-label="Window Manager controls">
      <WmPause />
      <WmDirection />
      <WmModes />
    </Bar>
  );
}

const WmPause = () => {
  const zebar = useContext(Zebar);
  const onClick = () => zebar.glazewm.runCommand('wm-toggle-pause');
  zebar?.glazewm?.isPaused && (
    <Status className="paused" path="intent/sleep" aria-label="paused" desc="Unpause" onClick={onClick} />
  );
};

const WmDirection = () => {
  const zebar = useContext(Zebar);
  const direction = zebar?.glazewm?.tilingDirection;
  const path = {
    'horizontal': 'intent/escape',
    'vertical': 'intent/debuff'
  }[direction];
  const onClick = () => zebar.glazewm.runCommand('toggle-tiling-direction');
  return (
    <Status className={`wm-tiling-direction wm-tiling-direction--${direction}`} path={path} aria-label={direction} desc="Swap tiling direction" onClick={onClick} />
  );
};

const modeMap = {
  'focus': 'intent/statuscard_00',
}
const WmModes = () => {
  const zebar = useContext(Zebar);
  return zebar?.glazewm?.bindingModes.map(({ name, displayName }) => {
    displayName = displayName || name;
    const onClick = () => zebar?.glazewm?.runCommand(`wm-disable-binding-mode --name ${name}`);
    return (
      <Status key={name} aria-label={displayName} desc={`Disable ${displayName} mode`} path={modeMap[name]} onClick={onClick} />
    );
  });
};

const Battery = ({ tooltipSide }) => {
  const zebar = useContext(Zebar);
  const data = zebar?.battery || {
    state: 'unknown',
  };
  if (data.state !== 'unknown') {
    const value = data.state === 'full' ? '' : Math.min(99, data.chargePercent || 0);
    return (
      <Tooltip side={tooltipSide} anchor={ tooltipId =>
          <div className={`battery battery--${data.state}`} role="menuitem" aria-disabled="true" tabIndex="0" aria-describedby={tooltipId}>
            <div className="battery__outer">
              <OutlinedText className="battery__inner">
                {value}
              </OutlinedText>
            </div>
          </div>
        }
      >
        Battery: {data.state} ({value}%)
      </Tooltip>
    );
  }
};

const Audio = ({...fallthrough}) => {
  const zebar = useContext(Zebar);
  const device = zebar?.audio?.defaultPlaybackDevice || {
    volume: 0,
    isMuted: true,
  };
  const displayVolume = `${device.volume}%`;
  const desc = `Audio device: ${device.name}; volume: ${displayVolume}${device.isMuted ? ' (muted)' : ''}`;
  const onClick = () => zebar?.audio?.setMute(!device.isMuted, { deviceId: device.deviceId });
  const onWheel = (event) => {
    const newVolume = Math.max(0, Math.min(100, device.volume + (event.deltaY < 0 ? 2 : -2)));
    if (newVolume !== device.volume) {
      zebar?.audio?.setVolume(newVolume, { deviceId: device.deviceId })
    }
  };
  return (
    <Status className="volume" path="power/ringing" desc={desc} label={displayVolume} onClick={onClick} onWheel={onWheel} {...fallthrough}>
       { device.isMuted && <SpireolgyIcon className="audio-muted-icon" path="power/well_laid_plans" /> }
    </Status>
  );
};

const weatherMap = {
  clear_day: 'radiance',
  clear_night: 'black_hole',
  cloudy: 'blur',
  light_rain: 'friendship',
  heavy_rain: 'storm',
  snow: 'hailstorm',
  thunder: 'thunder',
}
const Weather = ({ ...fallthrough }) => {
  const zebar = useContext(Zebar);
  const data = zebar?.weather ?? {
    status: 'clear_day',
    celsiusTemp: '?',
  };
  const cleanStatus = data.status.replace(/_/g, ' ');
  const displayTemp = `${Math.round(data.celsiusTemp)}°C`;
  const description = `Weather: ${cleanStatus} ${displayTemp}`;
  let simplifiedStatus;
  switch (data.status) {
    case 'clear_day':
    case 'clear_night':
      simplifiedStatus = data.status;
      break;
    case 'cloudy_day':
    case 'cloudy_night':
      simplifiedStatus = 'cloudy';
      break;
    case 'light_rain_day':
    case 'light_rain_night':
      simplifiedStatus = 'light_rain';
      break;
    case 'heavy_rain_day':
    case 'heavy_rain_night':
      simplifiedStatus = 'heavy_rain';
      break;
    case 'snow_day':
    case 'snow_night':
      simplifiedStatus = 'snow';
      break;
    case 'thunder_day':
    case 'thunder_night':
      simplifiedStatus = 'thunder';
      break;
    default:
      simplifiedStatus = 'clear';
  }
  const power = weatherMap[simplifiedStatus];
  return (
    <Status
      aria-disabled="true" 
      className={`weather weather--${simplifiedStatus}`}
      path={`power/${power}`}
      desc={description}
      label={displayTemp}
      {...fallthrough}
    />
  );
};

const useSpireology = (path) => {
  const manifest = useContext(Spireology);
  const [category, entry] = path.split('/');
  const categoryPlural = `${category}s`;
  let key;
  switch(category) {
    case 'power':
      key = `${entry.toUpperCase()}_${category.toUpperCase()}`;
      break;
    default:
      key = entry.toUpperCase();
  }
  const result = manifest?.[categoryPlural]?.[key];
  return result || {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    sheet: 'unknown',
  };
};

const SpireolgyIcon = ({className, path}) => {
  className = className || '';
  const { x, y, w, h, sheet } = useSpireology(path);
  return (
    <svg className={`spireology-icon ${className}`} viewBox={`${x} ${y} ${w} ${h}`} preserveAspectRatio="xMidYMid meet" role="presentation" data-path={path}>
      <image className="spireology-icon__image" href={`https://www.spireology.com/v0.103.2/assets/sprites/${sheet}.webp`} preserveAspectRatio="none"></image>
    </svg>
  )
};

const OutlinedText = ({className, children}) => {
  className = className || '';
  return (
    <span className={`outlined-text ${className}`}>
      <span className="outlined-text__foreground">{children}</span>
      <span className="outlined-text__background" aria-hidden="true">{children}</span>
    </span>
  );
}

const Tooltip = ({anchor, children}) => {
  const id = useId();
  return (
    <div className="tooltip-shrinkwrap">
      {anchor(id)}
      <div id={id} className="tooltip" role="tooltip">
        {children}
      </div>
    </div>
  );
};

const Status = ({ className, path, label, children, ...fallthrough }) => {
  className = className || '';
  return (
      <MenuItem className={`status ${className}`} {...fallthrough}>
        <SpireolgyIcon path={path} />
        <div className="status__suffix">
          <OutlinedText className="status__suffix-inner">{label}</OutlinedText>
        </div>
        {children}
      </MenuItem>
  );
}

const MenuItem = ({className, children, desc, ...fallthrough}) => {
  className = className || '';
  return (
    <Tooltip anchor={ tooltipId =>
        <button className={`menu-item ${className}`} role="menuitem" tabIndex="0" aria-describedby={tooltipId} {...fallthrough}>
          {children}
        </button>
      }
    >
      {desc}
    </Tooltip>
  );
}

createRoot(document.getElementById('root')).render(<App />);