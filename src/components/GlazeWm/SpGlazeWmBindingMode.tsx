import { useContext } from "react";
import { ZebarContext } from "../../contexts";
import SpPower from "../SpPower";
import SpTooltip from "../SpTooltip";
import { SpButton } from "../SpButton/SpButton";
import "./SpGlazeWmBindingMode.css";
export const defaultIconPath = "intents/status";

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
  const active = zebar?.glazewm?.bindingModes.find(
    ({ name: modeName }) => name === modeName,
  );

  if (active || showAlways) {
    displayName ??= active?.displayName ?? name;
    const resolvedPath = path ?? defaultIconPath;
    const onClick = () => {
      void zebar?.glazewm?.runCommand(
        `wm-${active ? "disable" : "enable"}-binding-mode --name ${name}`,
      );
    };
    const label = `${displayName} mode`;
    return (
      <SpTooltip
        anchor={(id) => (
          <SpButton
            className={`glazewm-binding-mode glazewm-binding-mode--${active ? "active" : "inactive"}`}
            aria-label={label}
            aria-pressed={!!active}
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
            {active ? (
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
