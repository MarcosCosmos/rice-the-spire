import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpMenuItem from "../SpMenuItem";
import SpPower from "../SpPower";
import SpSpireImage from "../SpSpireImage";

const SpGlazeControls = () => {
  const zebar = useContext(ZebarContext);
  return zebar?.glazewm ? (
    <>
      <WmPause />
      <WmDirection />
      <WmModes />
    </>
  ) : null;
};

const WmPause = () => {
  const zebar = useContext(ZebarContext);
  const onClick = () => zebar?.glazewm?.runCommand("wm-toggle-pause");

  return zebar?.glazewm?.isPaused ? (
    <SpMenuItem
      className="paused"
      aria-label="paused"
      tooltip="Unpause"
      onClick={onClick}
    >
      <SpSpireImage path="intents/sleep" />
    </SpMenuItem>
  ) : null;
};

const WmDirection = () => {
  const zebar = useContext(ZebarContext)!;
  const direction = zebar.glazewm!.tilingDirection;
  const path = {
    horizontal: "intents/escape",
    vertical: "intents/debuff",
  }[direction];
  const onClick = () => zebar?.glazewm?.runCommand("toggle-tiling-direction");
  const label = `Tiling direction: ${direction}`;
  const tooltip = (
    <>
      <h1>Tiling direction:</h1> {direction} (click to swap)
    </>
  );

  return (
    <SpMenuItem
      className={`wm-tiling-direction wm-tiling-direction--${direction}`}
      aria-label={label}
      tooltip={tooltip}
      onClick={onClick}
    >
      <SpSpireImage path={path} />
    </SpMenuItem>
  );
};

const WmModes = () => {
  const zebar = useContext(ZebarContext);
  const modeMap: Record<string, string> = {
    focus: "intents/status",
  };

  return zebar?.glazewm?.bindingModes.map(({ name, displayName }) => {
    displayName ||= name;
    const onClick = () =>
      zebar?.glazewm?.runCommand(`wm-disable-binding-mode --name ${name}`);
    const label = `${displayName} mode`;
    const tooltip = (
      <>
        <h1>{label}</h1> is on (click to disable)
      </>
    );
    return (
      <SpMenuItem
        key={name}
        aria-label={label}
        tooltip={tooltip}
        onClick={onClick}
      >
        <SpPower path={modeMap[name]} aria-hidden="true">
          {displayName}
        </SpPower>
      </SpMenuItem>
    );
  });
};

export default SpGlazeControls;
