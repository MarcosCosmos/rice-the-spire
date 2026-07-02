/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useContext } from "react";
import SpireContext from "../../contexts/SpireContext";
import resolveSpireImage from "../../util/resolveSpireImage";
import "./SpWorkspaceBackgroundGraphic.css";
import { useMapGeometry } from "./common";

export interface SpWorkspaceBackgroundGraphicProps {
  isDisplayed: boolean;
  hasFocus: boolean;
}

export const SpWorkspaceBackgroundGraphic = ({
  isDisplayed,
  hasFocus,
}: SpWorkspaceBackgroundGraphicProps) => {
  const config = useContext(SpireContext);

  const mapGeometry = useMapGeometry();
  if (mapGeometry) {
    const { images, maxNode, graphic, halfGraphic, circle } = mapGeometry;
    const markerX = -images[config.character].width / 2;
    const markerY = -(maxNode.height / 2 + images[config.character].height + 2);
    return (
      <svg
        className="sp-workspace-background-graphic"
        viewBox={`-${halfGraphic.width} -${halfGraphic.height} ${graphic.width} ${graphic.height}`}
        aria-hidden="true"
      >
        {isDisplayed && (
          <circle
            className="sp-workspace-background-graphic__circle"
            cx={0}
            cy={0}
            r={circle.radius}
            strokeWidth={circle.strokeWidth}
            strokeDasharray={`${circle.pathLegth}px`}
          />
        )}
        {hasFocus && (
          <image
            className="sp-workspace-background-graphic__marker"
            href={resolveSpireImage(`ui/map/map_marker_${config.character}`)}
            x={markerX}
            y={markerY}
          />
        )}
      </svg>
    );
  }
};
