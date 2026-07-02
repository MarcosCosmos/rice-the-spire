import {
  SpApp,
  SpireContext,
  SpToolbar,
  useRandomSpireConfig,
  SpMedia,
  SpGlazeWmDirection,
  SpGlazeWmPause,
  SpGlazeWmBindingModes,
  SpGlazeWmWorkspaces,
  SpMenuBar,
  type SpGlazeWmBindingModeConfig,
} from "@rice-the-spire";
import { createProviderGroup } from "zebar";

const providers = createProviderGroup({
  glazewm: { type: "glazewm" },
  media: { type: "media" },
});

const Widget = () => {
  const randomConfig = useRandomSpireConfig();
  const bindingModes: Record<string, SpGlazeWmBindingModeConfig> = {
    edit: {
      path: "intents/summon",
    },
  };

  return (
    <SpApp zebarProviders={providers}>
      <SpireContext value={randomConfig}>
        <SpMenuBar>
          <div className="column">
            <SpMedia />
          </div>
          <div className="column"></div>
          <div className="column">
            <SpToolbar
              className="wm-controls"
              aria-label="Window Manager controls"
              style={{ marginInline: "5rch" }}
            >
              <SpGlazeWmDirection />
              <SpGlazeWmPause showAlways />
              <SpGlazeWmBindingModes configMap={bindingModes} showAlways />
            </SpToolbar>
            <SpGlazeWmWorkspaces />
          </div>
        </SpMenuBar>
      </SpireContext>
    </SpApp>
  );
};

export default Widget;
