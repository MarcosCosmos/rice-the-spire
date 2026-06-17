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
  SpMedia,
} from "@rice-the-spire";
import type { SystrayIcon } from "zebar";

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

const Widget = () => {
  const randomConfig = useRandomSpireConfig();

  const priorities = ["Zebar", "GlazeWM", "Bluetooth"];
  const customSort = (a: SystrayIcon, b: SystrayIcon) => {
    const key = (icon: SystrayIcon) => {
      const hint = priorities.findIndex((x) => icon.tooltip.startsWith(x));
      console.log(icon.tooltip, hint, Math.max());
      return hint === -1 ? Infinity : hint;
    };
    return key(a) - key(b);
  };

  return (
    <SpApp
      zebar={{
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
      }}
    >
      <SpireContext value={randomConfig}>
        <BoundMenuBar>
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
              <SpMedia />
            </SpRegion>
          </div>
          <div className="column anchor-tooltips-inline-end">
            <SpSystemTray
              iconLimit={3}
              sortComparator={customSort}
              expandAnchor="end"
            />
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
