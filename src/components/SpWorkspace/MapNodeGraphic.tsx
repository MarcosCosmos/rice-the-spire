/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useContext } from "react";
import SpireContext from "../../contexts/SpireContext";
import resolveSpireImage from "../../util/resolveSpireImage";
import {
  mapMarkerDetails,
  circleRadius,
  circleStrokeWidth,
  graphicHeight,
  graphicWidth,
  halfWidth,
  markerX,
  midPoint,
  pathLength,
  type MapNodeDetails,
} from "./common";
import "./MapNodeGraphic.css";

export interface MapNodeGraphicProps {
  details: MapNodeDetails;
  path: string;
  isDisplayed: boolean;
  hasFocus: boolean;
}

export const MapNodeGraphic = ({
  details,
  path,
  isDisplayed,
  hasFocus,
}: MapNodeGraphicProps) => {
  const config = useContext(SpireContext);

  const nodeX = -details.width / 2;
  const nodeY = -details.height / 2;
  const markerY = -(details.height / 2 + mapMarkerDetails.height + 2);

  return (
    <svg
      className="map-node-graphic"
      viewBox={`-${halfWidth} -${halfWidth} ${graphicWidth} ${graphicHeight}`}
      aria-hidden="true"
    >
      {isDisplayed && (
        <circle
          cx={midPoint}
          cy={midPoint}
          r={circleRadius}
          strokeWidth={circleStrokeWidth}
          strokeDasharray={`${pathLength}px`}
        />
      )}
      <image
        className="map-node"
        href={resolveSpireImage(`ui/map_nodes/map_${path}`)}
        x={nodeX}
        y={nodeY}
        width={details.width}
        height={details.height}
      />
      {hasFocus && (
        <image
          className="map-pin"
          href={resolveSpireImage(`ui/map/map_marker_${config.character}`)}
          x={markerX}
          y={markerY}
          width={mapMarkerDetails.width}
          height={mapMarkerDetails.height}
        />
      )}
    </svg>
  );
};
