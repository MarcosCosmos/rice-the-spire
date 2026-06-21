import { useContext, type MouseEvent } from "react";
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
  const zebar = useContext(ZebarContext);
  const onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    void zebar?.systray?.onRightClick(id);
  };

  if ((tooltip?.length ?? 0) === 0) {
    tooltip = "Tray icon (Nameless)";
  }

  return (
    <SpTooltip
      anchor={(id) => (
        <SpButton
          id={`systray-icon-${id}`}
          className="tray-icon"
          disabled={disabled}
          aria-label={tooltip}
          aria-describedby={id}
          onMouseEnter={() => void zebar?.systray?.onHoverEnter(id)}
          onMouseLeave={() => void zebar?.systray?.onHoverLeave(id)}
          onMouseMove={() => void zebar?.systray?.onHoverMove(id)}
          onClick={() => void zebar?.systray?.onLeftClick(id)}
          onDoubleClick={() => void zebar?.systray?.onLeftClick(id)}
          onContextMenu={onContextMenu}
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
