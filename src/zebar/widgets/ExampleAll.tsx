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
  SpSystemTray,
  SpMedia,
  SpGlazeWmDirection,
  SpGlazeWmPause,
  SpGlazeWmBindingModes,
  SpGlazeWmWorkspaces,
  SpMenuBar,
  type SpGlazeWmBindingModeConfig,
  type SpireConfig,
} from "@rice-the-spire";
import { createProviderGroup, type SystrayIcon } from "zebar";
import type { SpWorkspaceConfig } from "../../components/SpWorkspace";

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
  const spire: SpireConfig = {
    character: "ironclad",
    act: "overgrowth",
    bannerColors: ["common"],
  };
  const bindingModes: Record<string, SpGlazeWmBindingModeConfig> = {
    death_blow: {
      displayName: "Death Blow",
      path: "intents/death_blow",
    },
    attack: {
      displayName: "Attack",
      path: "intents/attack",
    },
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

  const workspaces: Record<string, SpWorkspaceConfig> = {
    overgrowth: {
      displayName: "Overgrowth",
      nodeKind: "monster",
    },
    underdocks: {
      displayName: "Underdocks",
      nodeKind: "chest",
    },
    hive: {
      displayName: "Hive",
      nodeKind: "shop",
    },
    glory: {
      displayName: "Glory",
      nodeKind: "elite",
    },
  };

  return (
    <SpApp zebarProviders={providers}>
      <SpireContext value={spire}>
        <SpMenuBar>
          <div className="column">
            <SpGlazeWmWorkspaces
              configMap={workspaces}
              sourceSet="all"
              showAlways
            />
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
        </SpMenuBar>
      </SpireContext>
    </SpApp>
  );
};
export default Widget;
