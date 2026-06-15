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
} from "@rice-the-spire";

const Widget = () => {
  const randomSpireConfig = useRandomSpireConfig();
  return (
    <SpApp
      zebar={{
        glazewm: { type: "glazewm" },
        date: { type: "date" },
        cpu: { type: "cpu" },
        battery: { type: "battery" },
        memory: { type: "memory" },
        weather: { type: "weather" },
        media: { type: "media" },
        audio: { type: "audio" },
        disk: { type: "disk" },
        network: { type: "network" },
      }}
    >
      <SpireContext value={randomSpireConfig}>
        <SpMenuBar>
          <div className="column">
            <SpGlazeWorkspaces />
          </div>
          <div className="column">
            <SpRegion aria-label="Datetime">
              <SpDateTime />
            </SpRegion>
          </div>
          <div className="column anchor-tooltips-inline-end">
            <SpRegion
              className="wm-controls"
              aria-label="Window Manager controls"
            >
              <SpGlazeControls />
            </SpRegion>
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
