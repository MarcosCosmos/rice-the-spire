import React, {
  useState,
  useEffect,
  useId,
  createContext,
  useContext,
} from 'https://esm.sh/react@19.2?dev';
import { createRoot } from 'https://esm.sh/react-dom@19.2/client?dev';
import * as zebar from 'https://esm.sh/zebar@3.0';
const dummyZebar = {
  battery: {
    state: 'charging',
    chargePercent: 70,
  },
};

const useDummy = false;

const Zebar = createContext(null);
const Spireology = createContext(null);

const providers = zebar.createProviderGroup({
  glazewm: { type: 'glazewm' },
  date: { type: 'date' },
  cpu: { type: 'cpu' },
  battery: { type: 'battery' },
  memory: { type: 'memory' },
  weather: { type: 'weather' },
  media: { type: 'media' },
  audio: { type: 'audio' },
  disk: { type: "disk" },
  network: { type: "network" },
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
  const hasMode = output?.glazewm?.bindingModes.length > 0;
  const bindingModeClasses = hasMode
    ? output?.glazewm.bindingModes.map(mode => 'app--binding-mode-' + mode).join('')
    : 'app--no-binding-mode';
  return (
    <div className={`app ${bindingModeClasses}`} role="menubar">
      <Zebar value={output}>
          <Spireology value={spireology}>
            <div className="section">
              <GlazeWorkspaces />
            </div>
            <div className="section">
              <DateTime />
            </div>
            <div className="section">
              <WmControls />
              <Bar className="resources" aria-label="Resources">
                <Battery />
                <Network />  
                <Processor />
                <Memory />
                <FullestDisk />
              </Bar>    
              <Bar className="statuses" aria-label="Statuses">
                <Audio />
                <Weather />
              </Bar>    
            </div>
          </Spireology>
      </Zebar>
    </div>
  );
}

const Bar = ({className, ariaLabel, children, ...attrs}) => {
  className ||= '';
  if (attrs['aria-label']) {
    attrs = {
      role: 'region',
      ...attrs,
    };
  }
  return (
    <div className={`bar ${className}`} {...attrs}>
        {children}
    </div>
  );
};

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
const DateTime = () => {
  const zebar = useContext(Zebar);
  const date = zebar?.date || {
    now: Date.now()
  };
  const label = "Date and time";
  return (
    <Bar>
      <MenuItem
          className="datetime"
          aria-label={`${label}`}
          disabled
          tooltip={`${label}: longFormat.format(date.now)`}
      >
        <Status className="date" path="ui/top_bar/timer_icon" />
        <OutlinedText>{shortDateFormat.format(date.now)} {shortTimeFormat.format(date.now)}</OutlinedText>
      </MenuItem>
    </Bar>
  );
};

const GlazeWorkspaces = () => {
  const zebar = useContext(Zebar);
  return zebar?.glazewm && (
    <Bar className="workspaces" aria-label={"Workspaces"}>
      { zebar?.glazewm?.currentWorkspaces?.map(GlazeWorkspace) }
    </Bar>
  );
}

const workspaceStateMap = {
  'focused': 'map_elite',
  'displayed': 'map_unknown_elite',
  'empty': 'map_unknown',
  'full': 'map_monster',
};
const GlazeWorkspace = ({ name, displayName, hasFocus, isDisplayed, children }) => {
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
    style = 'full';
  }
  const path = workspaceStateMap[style];
  displayName ||= name;
  const workspaceDesc = `Workspace: ${displayName}; empty: ${isEmpty}; focused: ${hasFocus}; displayed: ${isDisplayed}.`;
  const onClick = () => zebar.glazewm.runCommand(`focus --workspace ${name}`);
  return (
    <MenuItem
      key={name}
      className={`workspace workspace--${style} ${hasFocus && 'workspace--focused'} ${isDisplayed && 'workspace--displayed'} ${isEmpty && 'workspace--empty'}`}
      tooltip={workspaceDesc}
      onClick={onClick}
    >
      <SpireImage className="workspace__background" path="ui/map_nodes/map_node_background"/>
      <Status className="workspace__status" path={`ui/map_nodes/${path}`}>{displayName || name}</Status>
    </MenuItem>
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
    <MenuItem className="paused" aria-label="paused" desc="Unpause" onClick={onClick}>
      <Status path="intents/sleep" />
    </MenuItem>
  );
};

const WmDirection = () => {
  const zebar = useContext(Zebar);
  const direction = zebar?.glazewm?.tilingDirection;
  const path = {
    'horizontal': 'intents/escape',
    'vertical': 'intents/debuff'
  }[direction];
  const onClick = () => zebar.glazewm.runCommand('toggle-tiling-direction');
  const label = `Tiling direction: ${direction}`;
  const tooltip = `${label} (click to swap)`;
  return (
    <MenuItem className={`wm-tiling-direction wm-tiling-direction--${direction}`} aria-label={label} tooltip={tooltip} onClick={onClick}>
      <Status path={path} />
    </MenuItem>
  );
};

const modeMap = {
  'focus': 'intents/status',
}
const WmModes = () => {
  const zebar = useContext(Zebar);
  return zebar?.glazewm?.bindingModes.map(({ name, displayName }) => {
    displayName ||= name;
    const onClick = () => zebar?.glazewm?.runCommand(`wm-disable-binding-mode --name ${name}`);
    const label = `${displayName} mode`;
    const tooltip = `${label} (click to disable)`;
    return (
      <MenuItem key={name} aria-label={label} tooltip={tooltip} onClick={onClick} >
        <Status path={modeMap[name]} aria-hidden="true">{displayName}</Status>
      </MenuItem>
    );
  });
};

const Media = () => {

};

const Battery = () => {
  const zebar = useContext(Zebar);
  const data = zebar?.battery || {
    state: 'unknown',
    chargePercent: 0,
  };
  if (data.state !== 'unknown') {
    const value = Math.round(data.chargePercent);
    return (
      <MenuItem 
        className={`battery battery--${data.state}`} 
        disabled
        aria-label={`Battery`}
        tooltip={`Battery: ${value}% (${data.state})`}
      >
        <Status path="relics/power_cell">{value}%</Status>
      </MenuItem>
    );
  }
};

const Network = () => {
  const zebar = useContext(Zebar);
  const currentInterface = zebar?.network?.defaultInterface;
  const traffic = zebar?.network?.traffic;
  return (
    <MenuItem 
        className={`network`} 
        disabled
        aria-label={`Network`}
        tooltip={`Network: {{TODO}}`}
      >
        <Status path="relics/gold_plated_cables">
          {traffic?.transmitted && useDataSize(traffic?.transmitted) || '-'}
          <br />
          {traffic?.received && useDataSize(traffic?.received) || '-'}
        </Status>
        { !currentInterface && <SpireImage className="network-none-icon" path="powers/well_laid_plans" /> }
      </MenuItem>
  );
}

// todo: other resources and tooltip details for resources
const Processor = () => {
  const zebar = useContext(Zebar);
  const cpu = zebar?.cpu;
  const usage = Math.round(cpu?.usage || 0);
  const tooltip = cpu && `CPU Usage: ${usage}%`;
  return (
    <MenuItem className="cpu" aria-label="CPU" tooltip={tooltip} disabled>
      <Status path="relics/cracked_core">{usage}%</Status>
    </MenuItem>
  )
};

const Memory = () => {
  const zebar = useContext(Zebar);
  const memory = zebar?.memory;
  const usage = Math.round(memory?.usage || 0);
  const tooltip = memory && `Memory usage: ${(memory.usedMemory*1e-9).toFixed(2)}GB/${(memory.totalMemory*1e-9).toFixed(2)}GB (${(memory.freeMemory*1e-9).toFixed(2)}GB free)`;
  return (
    <MenuItem className="memory" aria-label="Memory" tooltip={tooltip} disabled>
      <Status path="relics/emotion_chip">{usage}%</Status>
    </MenuItem>
  );
}

const useDataSize = (size, places) => {
  places ||= 2;
  let result = size.siValue.toFixed(places).replace(/\.0+$/, '');
  return `${result}${size.siUnit}`;
};

const FullestDisk = () => {
  const zebar = useContext(Zebar);
  if (zebar?.disk?.disks.length > 0) {
    const fullest = zebar?.disk?.disks
      .map(disk => ({
        ...disk,
        usage: Math.round(((disk.totalSpace.bytes-disk.availableSpace.bytes)/disk.totalSpace.bytes)*100)
      }))
      .sort((a, b) => a.usage - b.usage)
      [0];

    return (
      <Disk data={fullest} label="Fullest disk" />
    );
  }
}

const Disk = ({data, label, ...attrs}) => {
  label ||= 'Disk';
  const usage = Math.round(((data.totalSpace.bytes-data.availableSpace.bytes)/data.totalSpace.bytes)*100);
  const name = data.name || data.mountPoint;
  const tooltip = `${label}: ${name} ${data.isRemovable ? '(removable)' : ''}; usage: ${useDataSize(data.availableSpace)}/${useDataSize(data.totalSpace)}; mounted at: ${data.mountPoint}.`;
  return (
    <MenuItem className="disk" disabled tooltip={tooltip} aria-label={label} {...attrs}>
      <Status path="relics/data_disk">
        {usage}%
      </Status>
    </MenuItem>
  );
}

const Audio = ({...attrs}) => {
  const zebar = useContext(Zebar);
  const device = zebar?.audio?.defaultPlaybackDevice || {
    volume: 0,
    isMuted: true,
  };
  const displayVolume = `${device.volume}%`;
  const desc = `Volume: ${displayVolume}${device.isMuted ? ' (muted)' : ''}; audio device: ${device.name}.`;
  const onClick = () => zebar?.audio?.setMute(!device.isMuted, { deviceId: device.deviceId });
  const onWheel = (event) => {
    const newVolume = Math.max(0, Math.min(100, device.volume + (event.deltaY < 0 ? 2 : -2)));
    if (newVolume !== device.volume) {
      zebar?.audio?.setVolume(newVolume, { deviceId: device.deviceId })
    }
  };
  return (
    <MenuItem className="volume" tooltip={desc} onClick={onClick} aria-label="Volume" onWheel={onWheel} {...attrs}>
      <Status path="powers/ringing">{displayVolume}</Status>
      { device.isMuted && <SpireImage className="audio__muted-mark" path="powers/well_laid_plans" /> }
    </MenuItem>
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
const Weather = ({ ...attrs }) => {
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
  return (
    <MenuItem
      disabled 
      className={`weather weather--${simplifiedStatus}`}
      aria-label="Weather"
      tooltip={description}
      {...attrs}
    >
      <Status path={`powers/${weatherMap[simplifiedStatus]}`}>{displayTemp}</Status>
    </MenuItem>
  );
};

const resolveSpireImage = (path) => {
  let [category, subcategory, entry] = path.split('/');
  if (!entry) {
    entry = subcategory;
    subcategory = '';
  }
  let key;
  switch(category) {
    case 'powers':
    case 'orbs':
      if (entry === 'empty_slot') {
        break;
      } else {
        key = `${entry}_${category.slice(0, -1)}`;
        break;
      }
    default:
      key = entry;
  }
  const dir = subcategory && [category, subcategory].join('/') || category;
  return `https://spire-codex.com/static/images/${dir}/${key}.webp`;
};

const SpireImage = ({className, path, ...attrs}) => {
  className ||= '';
  return (
    <img className={`spire-codex-image ${className}`} src={resolveSpireImage(path)} />
  )
};

const OutlinedText = ({className, children}) => {
  className ||= '';
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

const Status = ({ className, path, children, ...attrs }) => {
  className ||= '';
  return (
      <div className={`status ${className}`} {...attrs}>
        <SpireImage className="status__image" path={path} />
        { children &&
          <div className="status__suffix">
            <OutlinedText className="status__suffix-inner">{children}</OutlinedText>
          </div>
        }
      </div>
  );
}

const MenuButton = ({className, children, disabled, ...attrs}) => {
  className ||= '';
  return (
    <button className={`menu-item ${className}`} role="menuitem" aria-disabled={disabled} tabIndex="0" {...attrs}>
      {children}
    </button>
  );
}

const MenuItem = ({children, tooltip, ...attrs}) => {
  const button = tooltipId => <MenuButton aria-describedby={tooltipId} {...attrs}>{children}</MenuButton>;
  return tooltip
    ? (
      <Tooltip anchor={button}>
        {tooltip}
      </Tooltip>
    )
    : button();
}

createRoot(document.getElementById('root')).render(<App />);