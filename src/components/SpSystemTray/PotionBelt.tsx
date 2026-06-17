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
        <image href={backdropUrl} />
      </svg>
      <div className="potion-belt__tray">
        <svg className="potion-belt__center-background" aria-hidden="true">
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
                className="potion-belt__right-bookend"
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
        <div className="potion-belt__content">{children}</div>
      </div>
      <svg
        className="potion-belt__right-bookend"
        viewBox="60 0 30 85"
        aria-hidden="true"
      >
        <image href={backdropUrl} />
      </svg>
    </div>
  );
};
