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

export const SpGlazeWmBindingModes = ({
  showAlways,
  configMap,
  fallbackIcon,
}: SpGlazeWmBindingModesProps) => {
  const glazewm = useContext(ZebarContext)?.glazewm;
  if (glazewm) {
    // the page should in principle order the objects by first occurence of the keys, so that it is stable with respect to the provided order.

    const resolvedEntries = new Map<string, SpGlazeWmBindingModeConfig>([
      ...Object.entries(configMap ?? {}),
      ...glazewm.bindingModes.map(
        ({ name, displayName }): [string, SpGlazeWmBindingModeConfig] => [
          name,
          { path: fallbackIcon, ...configMap?.[name], displayName },
        ],
      ),
    ]);

    return (
      <>
        {resolvedEntries.entries().map(([name, data]) => (
          <SpGlazeWmBindingMode
            key={name}
            name={name}
            showAlways={showAlways}
            {...data}
          />
        ))}
      </>
    );
  }
};
