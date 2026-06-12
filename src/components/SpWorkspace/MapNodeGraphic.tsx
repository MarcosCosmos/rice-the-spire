import { useContext, useState, useEffect, type CSSProperties } from "react";
import SpireContext from "../../data/SpireContext";
import resolveSpireImage from "../../util/resolveSpireImage";
import {
  mapNodeTypes,
  randomisableNodes,
  type MapNodeTypeName,
} from "./common";
import "./MapNodeGraphic.css";

const mapMarkerDetails = {
  width: 49,
  height: 64,
};

export interface MapNodeGraphicProps {
  nodeType: MapNodeTypeName;
  isEmpty: boolean;
  isDisplayed: boolean;
  hasFocus: boolean;
}

const MapNodeGraphic = ({
  nodeType,
  isEmpty,
  isDisplayed,
  hasFocus,
}: MapNodeGraphicProps) => {
  const config = useContext(SpireContext);
  const details = mapNodeTypes[nodeType];
  const [isVisited, setVisited] = useState(false);

  useEffect(() => {
    if (!isVisited && isDisplayed) {
      setVisited(true);
    }
  }, [isVisited, isDisplayed]);

  let path;
  if (isEmpty) {
    if (isVisited) {
      path = `unknown_${nodeType}`;
    } else {
      nodeType = "unknown";
      path = nodeType;
    }
  } else {
    path = nodeType;
  }

  const nodeX = -details.width / 2;
  const nodeY = -details.height / 2;
  const markerY = -(details.height / 2 + mapMarkerDetails.height + 2);
  const maxNodeWidth = Math.max(
    ...randomisableNodes.map((key) => mapNodeTypes[key].width),
  );
  const maxNodeHeight = Math.max(
    ...randomisableNodes.map((key) => mapNodeTypes[key].height),
  );
  const maxDimension = Math.max(maxNodeWidth, maxNodeHeight);
  const circleRatio = 0.9;
  const circleRadius = maxDimension * circleRatio;
  const circleStrokeWidth = (2 / 7) * circleRadius;
  const radiusWithStroke = circleRadius + circleStrokeWidth;
  const graphicWidth = 2 * radiusWithStroke;
  const graphicHeight =
    radiusWithStroke +
    Math.max(radiusWithStroke, maxNodeHeight / 2 + mapMarkerDetails.height + 2);
  const halfWidth = graphicWidth / 2;
  const midPoint = 0;
  const pathLength = 2 * Math.PI * circleRadius * 0.9;
  const markerX = -mapMarkerDetails.width / 2;

  const style: CSSProperties = {
    "--width-scale": `${graphicWidth / maxDimension}`,
    "--height-scale": `${graphicHeight / maxDimension}`,
    "--width-offset": `${radiusWithStroke / maxDimension}`,
    "--height-offset": `${details.height / maxDimension}`,
  } as CSSProperties;

  return (
    <svg
      className="map-node-graphic"
      viewBox={`-${halfWidth} -${halfWidth} ${graphicWidth} ${graphicHeight}`}
      style={style}
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
        href={resolveSpireImage(`ui/map_nodes/map_${path}`)}
        x={nodeX}
        y={nodeY}
        width={details.width}
        height={details.height}
      />
      {hasFocus && (
        <image
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

export default MapNodeGraphic;
