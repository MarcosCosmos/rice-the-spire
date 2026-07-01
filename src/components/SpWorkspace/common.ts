import { useState } from "react";
import { characters, type Character } from "../../contexts";
import { measureImages, type Dimensions } from "../../util/measureImages";
import { resolveSpireImage } from "../../util";

export interface MapNodeDetails extends Dimensions {
  obvious: boolean;
}

export type HiddenMapNodeKind = "monster" | "elite" | "shop" | "chest";
export type MapNodeKind = HiddenMapNodeKind | "unknown";

export interface MapGeometry {
  images: Record<MapNodeKind | Character, Dimensions>;
  maxNode: Dimensions;
  maxMarker: Dimensions;
  graphic: Dimensions;
  halfGraphic: Dimensions;
  circle: { radius: number; strokeWidth: number; pathLegth: number };
}

export const hiddenNodes: HiddenMapNodeKind[] = [
  "monster",
  "elite",
  "shop",
  "chest",
];

export const allNodes: MapNodeKind[] = [...hiddenNodes, "unknown"];

const loadMapGeometry = async () => {
  const sourceMap = Object.fromEntries([
    ...allNodes.map((node) => [
      resolveSpireImage(`ui/map_nodes/map_${node}`),
      node,
    ]),
    ...characters.map((character) => [
      resolveSpireImage(`ui/map/map_marker_${character}`),
      character,
    ]),
  ]) as Record<string, MapNodeKind | Character>;
  const results = await measureImages(...Object.keys(sourceMap));
  const imageGeometry = Object.fromEntries(
    Object.entries(results).map(([url, dims]) => [sourceMap[url], dims]),
  ) as Record<MapNodeKind | Character, Dimensions>;

  const maxNodeWidth = Math.max(
    ...allNodes.map((key) => imageGeometry[key].width),
  );
  const maxNodeHeight = Math.max(
    ...allNodes.map((key) => imageGeometry[key].height),
  );

  const maxMarkerWidth = Math.max(
    ...characters.map((character) => imageGeometry[character].height),
  );

  const maxMarkerHeight = Math.max(
    ...characters.map((character) => imageGeometry[character].height),
  );

  const maxNodeDimension = Math.max(maxNodeWidth, maxNodeHeight);
  const circleRatio = 0.9;
  const circleRadius = maxNodeDimension * circleRatio;
  const circleStrokeWidth = (2 / 7) * circleRadius;
  const radiusWithStroke = circleRadius + circleStrokeWidth;
  const graphicWidth = 2 * radiusWithStroke;
  const graphicHeight =
    radiusWithStroke +
    Math.max(radiusWithStroke, maxNodeHeight / 2 + maxMarkerHeight + 2);
  const circlePathLength = 2 * Math.PI * circleRadius * 0.9;

  return {
    images: imageGeometry,
    maxNode: { width: maxNodeWidth, height: maxNodeHeight },
    maxMarker: { width: maxMarkerWidth, height: maxMarkerHeight },
    graphic: { width: graphicWidth, height: graphicHeight },
    halfGraphic: { width: graphicWidth / 2, height: graphicHeight / 2 },
    circle: {
      radius: circleRadius,
      strokeWidth: circleStrokeWidth,
      pathLegth: circlePathLength,
    },
  };
};

let mapGeometryPromise: Promise<MapGeometry | undefined> | undefined;
export const useMapGeometry = () => {
  const [result, setResult] = useState<MapGeometry | undefined>();
  if (!result) {
    mapGeometryPromise ??= loadMapGeometry();
    void mapGeometryPromise.then((x) => {
      setResult(x);
    });
  }
  return result;
};
