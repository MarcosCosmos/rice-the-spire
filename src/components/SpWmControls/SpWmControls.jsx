import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpBar from "../SpBar";
import SpMenuItem from "../SpMenuItem";
import SpStatus from "../SpStatus";

const SpWmControls = () => {
  const zebar = useContext(ZebarContext);
  return zebar?.glazewm ? (
    <SpBar className="wm-controls" aria-label="Window Manager controls">
      <WmPause zebar={zebar} />
      <WmDirection zebar={zebar} />
      <WmModes zebar={zebar} />
    </SpBar>
  ) : null;
};

const WmPause = ({ zebar }) => {
  const onClick = () => zebar.glazewm.runCommand("wm-toggle-pause");

  return zebar?.glazewm?.isPaused ? (
    <SpMenuItem
      className="paused"
      aria-label="paused"
      desc="Unpause"
      onClick={onClick}
    >
      <SpStatus path="intents/sleep" />
    </SpMenuItem>
  ) : null;
};

const WmDirection = ({ zebar }) => {
  const direction = zebar?.glazewm?.tilingDirection;
  const path = {
    horizontal: "intents/escape",
    vertical: "intents/debuff",
  }[direction];
  const onClick = () => zebar.glazewm.runCommand("toggle-tiling-direction");
  const label = `Tiling direction: ${direction}`;
  const tooltip = `${label} (click to swap)`;

  return (
    <SpMenuItem
      className={`wm-tiling-direction wm-tiling-direction--${direction}`}
      aria-label={label}
      tooltip={tooltip}
      onClick={onClick}
    >
      <SpStatus path={path} />
    </SpMenuItem>
  );
};

const WmModes = ({ zebar }) => {
  const modeMap = {
    focus: "intents/status",
  };

  return zebar?.glazewm?.bindingModes.map(({ name, displayName }) => {
    displayName ||= name;
    const onClick = () =>
      zebar?.glazewm?.runCommand(`wm-disable-binding-mode --name ${name}`);
    const label = `${displayName} mode`;
    const tooltip = `${label} (click to disable)`;
    return (
      <SpMenuItem
        key={name}
        aria-label={label}
        tooltip={tooltip}
        onClick={onClick}
      >
        <SpStatus path={modeMap[name]} aria-hidden="true">
          {displayName}
        </SpStatus>
      </SpMenuItem>
    );
  });
};

export default SpWmControls;
