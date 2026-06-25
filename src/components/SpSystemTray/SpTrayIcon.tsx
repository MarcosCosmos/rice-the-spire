import { useContext, type KeyboardEvent, type MouseEvent } from "react";
import "./SpTrayIcon.css";
import { ZebarContext } from "../../contexts";
import SpTooltip from "../SpTooltip";
import { SpButton } from "../SpButton/SpButton";
export interface IconProps {
  id: string;
  iconUrl: string;
  tooltip?: string;
  disabled?: boolean;
}
export const SpTrayIcon = ({ id, iconUrl, tooltip, disabled }: IconProps) => {
  const systray = useContext(ZebarContext)?.systray;
  const onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    void systray?.onRightClick(id);
  };

  if ((tooltip?.length ?? 0) === 0) {
    tooltip = "Tray icon (Nameless)";
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Space" || event.key === "Enter") {
      if (event.shiftKey) {
        void systray?.onLeftDoubleClick(id);
      } else if (event.altKey) {
        void systray?.onRightClick(id);
      } else if (event.ctrlKey) {
        void systray?.onMiddleClick(id);
      } else {
        void systray?.onLeftClick(id);
      }
    } else if (event.key === "ContextMenu") {
      void systray?.onRightClick(id);
    }
  };

  return (
    <SpTooltip
      anchor={(tooltipId) => (
        <SpButton
          className="tray-icon"
          role="menuitem"
          disabled={disabled}
          aria-label={tooltip}
          aria-describedby={tooltipId}
          onMouseEnter={() => void systray?.onHoverEnter(id)}
          onMouseLeave={() => void systray?.onHoverLeave(id)}
          onMouseMove={() => void systray?.onHoverMove(id)}
          onClick={() => void systray?.onLeftClick(id)}
          onDoubleClick={() => void systray?.onLeftClick(id)}
          onContextMenu={onContextMenu}
          onKeyDown={onKeyDown}
        >
          <img
            className="tray-icon__src-icon"
            src={iconUrl}
            aria-hidden="true"
          />
        </SpButton>
      )}
      desc={tooltip}
    />
  );
};
