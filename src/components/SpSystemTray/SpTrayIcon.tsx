import React, { useContext, type MouseEvent } from "react";
import SpMenuItem from "../SpMenuItem";
import "./SpTrayIcon.css";
import { ZebarContext } from "../../contexts";
export interface IconProps {
  id: string;
  iconUrl: string;
  tooltip?: string;
}
const SpTrayIcon = ({ id, iconUrl, tooltip }: IconProps) => {
  const zebar = useContext(ZebarContext);
  const onContextMenu = (event: MouseEvent) => {
    zebar?.systray?.onRightClick(id);
    event.preventDefault();
  };
  return (
    <SpMenuItem
      id={`systray-icon-${id}`}
      className="tray-icon"
      tooltip={tooltip || "?"}
      aria-label={tooltip || "Unidentified system tray icon"}
      onMouseEnter={() => zebar?.systray?.onHoverEnter(id)}
      onMouseLeave={() => zebar?.systray?.onHoverLeave(id)}
      onMouseMove={() => zebar?.systray?.onHoverMove(id)}
      onClick={() => zebar?.systray?.onLeftClick(id)}
      onDoubleClick={() => zebar?.systray?.onLeftClick(id)}
      onContextMenu={onContextMenu}
    >
      <img src={iconUrl} aria-hidden="true" />
    </SpMenuItem>
  );
};
export default SpTrayIcon;
