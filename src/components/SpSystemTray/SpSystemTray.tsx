import { useContext } from "react";
import { resolveSpireImage } from "../../util";
import SpRegion from "../SpRegion";
import "./SpSystemTray.css";
import { ZebarContext } from "../../contexts";
import { SpTrayIcon } from "./SpTrayIcon";

export const SpSystemTray = () => {
  const backdropUrl = resolveSpireImage("ui/top_bar/top_bar_char_backdrop");
  const zebar = useContext(ZebarContext);
  return (
    <SpRegion className="system-tray" aria-label="System Tray">
      <svg
        className="system-tray__left-bookend"
        viewBox="0 0 30 85"
        aria-hidden="true"
      >
        <image href={backdropUrl} />
      </svg>
      <div className="system-tray__tray">
        <svg className="system-tray__center-background" aria-hidden="true">
          <defs>
            <pattern
              id="center"
              patternContentUnits="userSpaceOnUse"
              height="100%"
              width="30px"
              x="0"
              y="0"
              patternUnits="userSpaceOnUse"
            >
              <svg
                className="system-tray__right-bookend"
                viewBox="60 0 30 85"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <image href={backdropUrl} />
              </svg>
            </pattern>
          </defs>
          <rect width="110%" height="100%" fill="url(#center)" />
        </svg>
        <div className="system-tray__content">
          {zebar?.systray?.icons.map((data) => (
            <SpTrayIcon key={data.id} {...data} />
          ))}
        </div>
      </div>
      <svg
        className="system-tray__right-bookend"
        viewBox="60 0 30 85"
        aria-hidden="true"
      >
        <image href={backdropUrl} />
      </svg>
    </SpRegion>
  );
};
