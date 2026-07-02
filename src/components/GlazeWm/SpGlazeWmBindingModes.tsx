import { useContext } from "react";
import ZebarContext from "../../contexts/ZebarContext";
import {
  SpGlazeWmBindingMode,
  type SpGlazeWmBindingModeConfig,
} from "./SpGlazeWmBindingMode";

export interface SpGlazeWmBindingModesProps {
  showAlways?: boolean;
  configMap?: Record<string, SpGlazeWmBindingModeConfig>;
  fallbackIcon?: string;
}

// todo: drop-shadow animations for wm controls

export const SpGlazeWmBindingModes = ({
  showAlways,
  configMap,
  fallbackIcon,
}: SpGlazeWmBindingModesProps) => {
  const glazewm = useContext(ZebarContext)?.glazewm;
  if (glazewm) {
    const resolvedEntries = new Map<string, SpGlazeWmBindingModeConfig>([
      ...Object.entries(configMap ?? {}),
      ...glazewm.bindingModes.map(
        ({ name, displayName }): [string, SpGlazeWmBindingModeConfig] => {
          const config = configMap?.[name];
          return [
            name,
            {
              path: fallbackIcon,
              ...config,
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              displayName: displayName ?? config?.displayName,
            },
          ];
        },
      ),
    ]);

    return (
      <>
        {[
          ...resolvedEntries
            .entries()
            .map(([name, data]) => (
              <SpGlazeWmBindingMode
                key={name}
                name={name}
                showAlways={showAlways}
                {...data}
              />
            )),
        ]}
      </>
    );
  }
};
