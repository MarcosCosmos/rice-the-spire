import { useContext, useEffect, useState, type ReactNode } from "react";
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
  type SpireConfig,
  SpRegion,
  defaultSpireConfig,
  acts,
  characters,
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
const Default = () => {
  const [spireConfig, setSpireConfig] =
    useState<SpireConfig>(defaultSpireConfig);
  useEffect(() => {
    const randomConfig: SpireConfig = {
      act: acts[Math.floor(Math.random() * acts.length)],
      character: characters[Math.floor(Math.random() * characters.length)],
    };
    setSpireConfig(randomConfig);
  }, []);

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
      <SpireContext value={spireConfig}>
        <BoundMenuBar>
          <div className="column">
            <SpGlazeWorkspaces />
          </div>
          <div className="column">
            <SpRegion aria-label="Resources">
              <SpDateTime />
            </SpRegion>
          </div>
          <div className="column">
            {/* <SpRegion className="media" aria-label="Media">
              <SpMedia />
            </SpRegion> */}
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
          </div>
        </BoundMenuBar>
      </SpireContext>
    </SpApp>
  );
};
export default Default;
