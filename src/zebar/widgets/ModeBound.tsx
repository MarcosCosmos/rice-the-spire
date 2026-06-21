import { useContext, type ReactNode } from "react";
import {
  SpApp,
  SpAudio,
  SpBattery,
  SpDateTime,
  SpFullestDisk,
  SpireContext,
  SpMemory,
  SpMenuBar,
  SpNetwork,
  SpProcessor,
  SpWeather,
  ZebarContext,
  SpToolbar,
  useRandomSpireConfig,
  SpSystemTray,
  SpMedia,
  SpGlazeWmDirection,
  SpGlazeWmPause,
  SpGlazeWmBindingModes,
  SpGlazeWmWorkspaces,
} from "@rice-the-spire";
import { createProviderGroup, type SystrayIcon } from "zebar";

const BoundMenuBar = ({ children }: { children: ReactNode }) => {
  const zebar = useContext(ZebarContext);
  const bindingModeClasses =
    (zebar?.glazewm?.bindingModes
      .map((mode) => "menubar--binding-mode-" + mode.name)
      .join("") ??
      "") ||
    "menubar--no-binding-mode";
  return (
    <SpMenuBar className={`menubar--modebound ${bindingModeClasses}`}>
      {children}
    </SpMenuBar>
  );
};

const providers = createProviderGroup({
  glazewm: { type: "glazewm" },
  cpu: { type: "cpu" },
  battery: { type: "battery" },
  memory: { type: "memory" },
  weather: { type: "weather" },
  media: { type: "media" },
  audio: { type: "audio" },
  disk: { type: "disk" },
  network: { type: "network" },
  systray: { type: "systray" },
});

const Widget = () => {
  const randomConfig = useRandomSpireConfig();
  const bindingModes = {
    focus: {
      displayName: "focus",
      path: "intents/summon",
    },
  };
  const trayPriorities = [
    "Zebar",
    "Safely Remove Hardware and Eject Media",
    "Bluetooth",
    "Discord",
    "Steam",
    "GlazeWM",
  ];
  const traySort = (a: SystrayIcon, b: SystrayIcon) => {
    const key = (icon: SystrayIcon) => {
      const hint = trayPriorities.findIndex((x) => icon.tooltip.startsWith(x));
      return hint === -1 ? trayPriorities.length : hint;
    };
    return key(a) - key(b);
  };

  return (
    <SpApp zebarProviders={providers}>
      <SpireContext value={randomConfig}>
        <BoundMenuBar>
          <div className="column">
            <SpGlazeWmWorkspaces />
            <SpToolbar
              className="wm-controls"
              aria-label="Window Manager controls"
            >
              <SpGlazeWmDirection />
              <SpGlazeWmPause showAlways />
              <SpGlazeWmBindingModes configMap={bindingModes} showAlways />
            </SpToolbar>
          </div>
          <div className="column">
            <SpMedia />
          </div>
          <div className="column">
            <SpSystemTray
              iconLimit={3}
              sortComparator={traySort}
              expandDirection="start"
              expandFloating
            />

            <SpToolbar
              className="statuses anchor-tooltips-inline-end margin-block-start"
              aria-label="Statuses"
            >
              <SpDateTime />
              <SpAudio />
              <SpWeather />
              <SpBattery />
              <SpMemory />
              <SpFullestDisk />
              <SpProcessor />
              <SpNetwork />
            </SpToolbar>
          </div>
        </BoundMenuBar>
      </SpireContext>
    </SpApp>
  );
};
export default Widget;
