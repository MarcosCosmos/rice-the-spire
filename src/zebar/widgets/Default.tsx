import {
  SpApp,
  SpAudio,
  SpBattery,
  SpDateTime,
  SpFullestDisk,
  SpGlazeWmWorkspaces,
  SpireContext,
  SpMemory,
  SpMenuBar,
  SpNetwork,
  SpProcessor,
  SpWeather,
  SpToolbar,
  useRandomSpireConfig,
  SpSystemTray,
  SpGlazeWmPause,
  SpGlazeWmDirection,
  SpGlazeWmBindingModes,
  SpMedia,
} from "@rice-the-spire";
import { createProviderGroup } from "zebar";

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
  const randomSpireConfig = useRandomSpireConfig();

  return (
    <SpApp zebarProviders={providers}>
      <SpireContext value={randomSpireConfig}>
        <SpMenuBar>
          <div className="column">
            <SpGlazeWmWorkspaces />
            <SpToolbar
              className="wm-controls"
              aria-label="Window Manager controls"
            >
              <SpGlazeWmDirection />
              <SpGlazeWmPause />
              <SpGlazeWmBindingModes />
            </SpToolbar>
          </div>
          <div className="column">
            <SpMedia />
          </div>
          <div className="column">
            <SpSystemTray iconLimit={3} expandDirection="start" />

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
