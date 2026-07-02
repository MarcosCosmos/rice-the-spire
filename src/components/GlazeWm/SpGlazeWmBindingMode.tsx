import { useContext } from "react";
import { ZebarContext } from "../../contexts";
import SpPower from "../SpPower";
import SpTooltip from "../SpTooltip";
import { SpButton } from "../SpButton/SpButton";
export const defaultIconPath = "intents/unknown";

export interface SpGlazeWmBindingModeConfig {
  displayName?: string;
  path?: string;
}
export interface SpGlazeWmBindingModeProps extends SpGlazeWmBindingModeConfig {
  name: string;
  displayName?: string;
  path?: string;
  showAlways?: boolean;
}
export const SpGlazeWmBindingMode = ({
  name,
  displayName,
  path,
  showAlways,
}: SpGlazeWmBindingModeProps) => {
  const zebar = useContext(ZebarContext);
  const resolvedState = zebar?.glazewm?.bindingModes.find(
    ({ name: modeName }) => name === modeName,
  );

  if (resolvedState || showAlways) {
    displayName ??= resolvedState?.displayName ?? name;
    const resolvedPath = path ?? defaultIconPath;
    const onClick = () => {
      void zebar?.glazewm?.runCommand(
        `wm-${resolvedState ? "disable" : "enable"}-binding-mode --name ${name}`,
      );
    };
    const label = `${displayName} mode`;
    return (
      <SpTooltip
        anchor={(id) => (
          <SpButton
            className={`sp-glazewm-binding-mode sp-glazewm-binding-mode--${resolvedState ? "active" : "inactive"}`}
            toggle
            aria-label={label}
            aria-pressed={!!resolvedState}
            aria-describedby={id}
            onClick={onClick}
          >
            <SpPower path={resolvedPath} aria-hidden="true">
              {displayName}
            </SpPower>
          </SpButton>
        )}
        desc={
          <>
            <strong>{displayName}</strong> mode{" "}
            {resolvedState ? (
              <>
                is <em>on</em> (click to disable)
              </>
            ) : (
              <>is off (click to enable)</>
            )}
          </>
        }
      />
    );
  }
};
