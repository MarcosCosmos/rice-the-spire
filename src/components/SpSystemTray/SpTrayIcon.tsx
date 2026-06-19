import { useContext, type MouseEvent } from "react";
import SpMenuItem from "../SpMenuItem";
import "./SpTrayIcon.css";
import { ZebarContext } from "../../contexts";
export interface IconProps {
  id: string;
  iconUrl: string;
  tooltip?: string;
}
export const SpTrayIcon = ({ id, iconUrl, tooltip }: IconProps) => {
  const zebar = useContext(ZebarContext);
  const onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    void zebar?.systray?.onRightClick(id);
  };

  if ((tooltip?.length ?? 0) === 0) {
    tooltip = "Tray icon (Nameless)";
  }
  return (
    <SpMenuItem
      id={`systray-icon-${id}`}
      className="tray-icon"
      tooltip={tooltip}
      aria-label={tooltip}
      onMouseEnter={() => void zebar?.systray?.onHoverEnter(id)}
      onMouseLeave={() => void zebar?.systray?.onHoverLeave(id)}
      onMouseMove={() => void zebar?.systray?.onHoverMove(id)}
      onClick={() => void zebar?.systray?.onLeftClick(id)}
      onDoubleClick={() => void zebar?.systray?.onLeftClick(id)}
      onContextMenu={onContextMenu}
    >
      <img className="tray-icon__src-icon" src={iconUrl} aria-hidden="true" />
    </SpMenuItem>
  );
};
