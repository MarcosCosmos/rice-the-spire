export interface MapNodeDetails {
  width: number;
  height: number;
  obvious: boolean;
}

export type MapNodeTypeName = keyof typeof mapNodeTypes;

export const mapNodeTypes: Record<string, MapNodeDetails> = {
  monster: { width: 66, height: 68, obvious: false },
  elite: { width: 89, height: 70, obvious: false },
  shop: { width: 69, height: 72, obvious: false },
  chest: { width: 84, height: 59, obvious: false },
  rest: { width: 61, height: 90, obvious: true },
  unknown: { width: 73, height: 72, obvious: true },
};

export const randomisableNodes: MapNodeTypeName[] = Object.entries(mapNodeTypes)
  .filter(([, details]) => !details.obvious)
  .map(([key]) => key);

export const mapMarkerDetails = {
  width: 49,
  height: 64,
};

export const maxNodeWidth = Math.max(
  ...randomisableNodes.map((key) => mapNodeTypes[key].width),
);
export const maxNodeHeight = Math.max(
  ...randomisableNodes.map((key) => mapNodeTypes[key].height),
);

export const maxDimension = Math.max(maxNodeWidth, maxNodeHeight);
export const circleRatio = 0.9;
export const circleRadius = maxDimension * circleRatio;
export const circleStrokeWidth = (2 / 7) * circleRadius;
export const radiusWithStroke = circleRadius + circleStrokeWidth;
export const graphicWidth = 2 * radiusWithStroke;
export const graphicHeight =
  radiusWithStroke +
  Math.max(radiusWithStroke, maxNodeHeight / 2 + mapMarkerDetails.height + 2);
export const halfWidth = graphicWidth / 2;
export const midPoint = 0;
export const pathLength = 2 * Math.PI * circleRadius * 0.9;
export const markerX = -mapMarkerDetails.width / 2;
