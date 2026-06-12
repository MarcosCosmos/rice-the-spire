import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import { Bar } from "../";
import { MenuItem } from "../";
import { Status } from "../";

const WmControls = () => {
  const zebar = useContext(ZebarContext);
  return zebar?.glazewm ? (
    <Bar className="wm-controls" aria-label="Window Manager controls">
      <WmPause zebar={zebar} />
      <WmDirection zebar={zebar} />
      <WmModes zebar={zebar} />
    </Bar>
  ) : null;
};

const WmPause = ({ zebar }) => {
  const onClick = () => zebar.glazewm.runCommand("wm-toggle-pause");

  return zebar?.glazewm?.isPaused ? (
    <MenuItem
      className="paused"
      aria-label="paused"
      desc="Unpause"
      onClick={onClick}
    >
      <Status path="intents/sleep" />
    </MenuItem>
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
    <MenuItem
      className={`wm-tiling-direction wm-tiling-direction--${direction}`}
      aria-label={label}
      tooltip={tooltip}
      onClick={onClick}
    >
      <Status path={path} />
    </MenuItem>
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
      <MenuItem
        key={name}
        aria-label={label}
        tooltip={tooltip}
        onClick={onClick}
      >
        <Status path={modeMap[name]} aria-hidden="true">
          {displayName}
        </Status>
      </MenuItem>
    );
  });
};

export default WmControls;
