import {
  SpApp,
  SpAudio,
  SpBattery,
  SpDateTime,
  SpFullestDisk,
  SpireContext,
  SpMemory,
  SpNetwork,
  SpProcessor,
  SpWeather,
  SpToolbar,
  useRandomSpireConfig,
  SpSystemTray,
  SpGlazeWmDirection,
  SpGlazeWmPause,
  SpGlazeWmBindingModes,
  SpGlazeWmWorkspaces,
  SpMenuBar,
  type SpGlazeWmBindingModeConfig,
} from "@rice-the-spire";
import { createProviderGroup, type SystrayIcon } from "zebar";
import type { SpWorkspaceConfig } from "../../components/SpWorkspace";

const providers = createProviderGroup({
  glazewm: { type: "glazewm" },
  cpu: { type: "cpu" },
  battery: { type: "battery" },
  memory: { type: "memory" },
  weather: { type: "weather" },
  audio: { type: "audio" },
  disk: { type: "disk" },
  network: { type: "network" },
  systray: { type: "systray" },
});

const Widget = () => {
  const randomConfig = useRandomSpireConfig();
  const bindingModes: Record<string, SpGlazeWmBindingModeConfig> = {
    edit: {
      path: "intents/summon",
    },
  };
  const workspaces: Record<string, SpWorkspaceConfig> = {
    "6": { displayName: "6|code" },
    "7": { displayName: "7|web" },
    "8": {},
    "9": { displayName: "9|what" },
    "0": { displayName: "0|cord" },
  };
  const trayPriorities = [
    "Zebar",
    "GlazeWM",
    "Safely Remove Hardware and Eject Media",
    "Bluetooth",
    "Discord",
    "Steam",
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
        <SpMenuBar>
          <div className="column">
            <SpGlazeWmWorkspaces configMap={workspaces} />
            <SpToolbar
              className="wm-controls"
              aria-label="Window Manager controls"
              style={{ marginInline: "5rch" }}
            >
              <SpGlazeWmDirection />
              <SpGlazeWmPause showAlways />
              <SpGlazeWmBindingModes configMap={bindingModes} showAlways />
            </SpToolbar>
          </div>
          <div className="column"></div>
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
        </SpMenuBar>
      </SpireContext>
    </SpApp>
  );
};

export default Widget;
