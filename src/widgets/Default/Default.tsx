import { useContext, useEffect, useState, type ReactNode } from "react";
import SpireContext, {
  acts,
  characters,
  type SpireConfig,
  defaultConfig as defaultSpireConfig,
} from "../../data/SpireContext";
import MenuBar from "../../components/MenuBar/MenuBar";
import ZebarContext from "../../data/ZebarContext";
import App from "../../components/App";
import Bar from "../../components/Bar";
import Battery from "../../components/Battery";
import DateTime from "../../components/DateTime";
import FullestDisk from "../../components/FullestDisk";
import GlazeWorkspaces from "../../components/GlazeWorkspaces";
import Memory from "../../components/Memory";
import Network from "../../components/Network";
import Processor from "../../components/Processor";
import Weather from "../../components/Weather";
import WmControls from "../../components/WmControls";
import SpAudio from "../../components/SpAudio";

const BoundMenuBar = ({ children }: { children: ReactNode }) => {
  const zebar = useContext(ZebarContext);
  const hasMode = (zebar?.glazewm?.bindingModes?.length || 0) > 0;
  const bindingModeClasses = hasMode
    ? zebar?.glazewm?.bindingModes
        .map((mode) => "menubar--binding-mode-" + mode)
        .join("")
    : "menubar--no-binding-mode";
  return <MenuBar className={bindingModeClasses}>{children}</MenuBar>;
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
    <App
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
            <GlazeWorkspaces />
          </div>
          <div className="section">
            <DateTime />
          </div>
          <div className="section">
            <WmControls />
            <Bar className="resources" aria-label="Resources">
              <Battery />
              <Network />
              <Processor />
              <Memory />
              <FullestDisk />
            </Bar>
            <Bar className="statuses" aria-label="Statuses">
              <SpAudio />
              <Weather />
            </Bar>
          </div>
        </BoundMenuBar>
      </SpireContext>
    </App>
  );
};
export default Default;
