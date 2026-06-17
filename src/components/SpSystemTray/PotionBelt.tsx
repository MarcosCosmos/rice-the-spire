import type { ReactNode } from "react";
import resolveSpireImage from "../../util/resolveSpireImage";
import "./PotionBelt.css";

export const PotionBelt = ({ children }: { children: ReactNode }) => {
  const backdropUrl = resolveSpireImage("ui/top_bar/top_bar_char_backdrop");
  return (
    <div className="potion-belt">
      <svg
        className="potion-belt__left-bookend"
        viewBox="0 0 30 85"
        aria-hidden="true"
      >
        <image href={backdropUrl} x="0" y="0" width="90" height="85" />
      </svg>
      <div className="potion-belt__tray">
        <svg
          className="potion-belt__center-background"
          viewBox="30 0 30 85"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <image href={backdropUrl} x="0" y="0" width="90" height="85" />
        </svg>
        <div className="potion-belt__content">{children}</div>
      </div>
      <svg
        className="potion-belt__right-bookend"
        viewBox="60 0 30 85"
        aria-hidden="true"
      >
        <image href={backdropUrl} x="0" y="0" width="90" height="85" />
      </svg>
    </div>
  );
};
