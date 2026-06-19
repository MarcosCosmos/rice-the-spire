import {
  SpApp,
  SpAudio,
  SpBattery,
  SpDateTime,
  SpFullestDisk,
  SpGlazeWorkspaces,
  SpGlazeControls,
  SpireContext,
  SpMemory,
  SpMenuBar,
  SpNetwork,
  SpProcessor,
  SpWeather,
  SpRegion,
  useRandomSpireConfig,
  SpCredits,
  SpSystemTray,
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
            <SpGlazeWorkspaces />
            <SpRegion
              className="wm-controls"
              aria-label="Window Manager controls"
            >
              <SpGlazeControls />
            </SpRegion>
          </div>
          <div className="column">
            <SpRegion aria-label="Datetime">
              <SpDateTime />
            </SpRegion>
          </div>
          <div className="column anchor-tooltips-inline-end">
            <SpSystemTray />
            <SpRegion className="resources" aria-label="Resources">
              <SpBattery />
              <SpNetwork />
              <SpProcessor />
              <SpMemory />
              <SpFullestDisk />
            </SpRegion>
            <SpRegion className="statuses" aria-label="Statuses">
              <SpAudio />
              <SpWeather />
            </SpRegion>
            <SpRegion aria-label="Credits">
              <SpCredits />
            </SpRegion>
          </div>
        </SpMenuBar>
      </SpireContext>
    </SpApp>
  );
};
export default Widget;
