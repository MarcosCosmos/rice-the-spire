import { useContext, useEffect, useState, type ReactNode } from "react";
import SpireContext, {
  acts,
  characters,
  type SpireConfig,
  defaultConfig as defaultSpireConfig,
} from "../../data/SpireContext";
import SpAudio from "../../components/SpAudio";
import SpFullestDisk from "../../components/SpFullestDisk";
import ZebarContext from "../../data/ZebarContext";
import SpApp from "../../components/SpApp";
import SpBar from "../../components/SpBar";
import SpBattery from "../../components/SpBattery";
import SpDateTime from "../../components/SpDateTime/SpDateTime";
import SpGlazeWorkspaces from "../../components/SpGlazeWorkspaces";
import SpMemory from "../../components/SpMemory";
import SpMenuBar from "../../components/SpMenuBar";
import SpNetwork from "../../components/SpNetwork";
import SpProcessor from "../../components/SpProcessor";
import SpWeather from "../../components/SpWeather";
import SpWmControls from "../../components/SpWmControls";

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
          <div className="section">
            <SpGlazeWorkspaces />
          </div>
          <div className="section">
            <SpDateTime />
          </div>
          <div className="section">
            <SpWmControls />
            <SpBar className="resources" aria-label="Resources">
              <SpBattery />
              <SpNetwork />
              <SpProcessor />
              <SpMemory />
              <SpFullestDisk />
            </SpBar>
            <SpBar className="statuses" aria-label="Statuses">
              <SpAudio />
              <SpWeather />
            </SpBar>
          </div>
        </BoundMenuBar>
      </SpireContext>
    </SpApp>
  );
};
export default Default;
