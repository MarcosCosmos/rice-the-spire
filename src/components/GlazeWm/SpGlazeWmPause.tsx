import { useContext } from "react";
import { ZebarContext } from "../../contexts";
import { SpButton } from "../SpButton/SpButton";
import SpSpireImage from "../SpSpireImage";
import SpTooltip from "../SpTooltip";

export interface SpGlazeWmPauseProps {
  showAlways?: boolean;
}
export const SpGlazeWmPause = ({ showAlways }: SpGlazeWmPauseProps) => {
  const glazewm = useContext(ZebarContext)?.glazewm;
  if (glazewm) {
    const onClick = () => {
      void glazewm.runCommand("wm-toggle-pause");
    };

    // todo: the animation doesn't seem to have enough distinct layers yet to match the game but for now that's OK.
    // also we could use svg to achieve fancy drop shadow effects later.

    return showAlways || glazewm.isPaused ? (
      <SpTooltip
        anchor={(id) => (
          <SpButton
            className={`glazewm-pause glazewm-pause--${glazewm.isPaused ? "paused" : "unpaused"}`}
            highlightWhenActive
            highlightWhenInactive
            aria-label="paused"
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            aria-pressed={glazewm.isPaused ?? false}
            aria-describedby={id}
            onClick={onClick}
          >
            <SpSpireImage path="intents/sleep" />
          </SpButton>
        )}
        desc={<>{glazewm.isPaused ? "Unpause" : "Pause"} GlazeWM</>}
      />
    ) : null;
  }
};
