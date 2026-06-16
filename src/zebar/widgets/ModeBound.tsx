import { useContext, type ReactNode } from "react";
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
  ZebarContext,
  SpRegion,
  useRandomSpireConfig,
  SpCredits,
  SpSystemTray,
} from "@rice-the-spire";

const BoundMenuBar = ({ children }: { children: ReactNode }) => {
  const zebar = useContext(ZebarContext);
  const hasMode = (zebar?.glazewm?.bindingModes?.length || 0) > 0;
  const bindingModeClasses = hasMode
    ? zebar?.glazewm?.bindingModes
        .map((mode) => "menubar--binding-mode-" + mode)
        .join("")
    : "menubar--no-binding-mode";
  return <SpMenuBar className={bindingModeClasses}>{children}</SpMenuBar>;
};

const Widget = () => {
  const randomConfig = useRandomSpireConfig();

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
        systray: { type: "systray" },
      }}
    >
      <SpireContext value={randomConfig}>
        <BoundMenuBar>
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
        </BoundMenuBar>
      </SpireContext>
    </SpApp>
  );
};
export default Widget;
