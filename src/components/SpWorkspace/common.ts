export interface MapNodeType {
  width: number;
  height: number;
  obvious: boolean;
}

export type MapNodeTypeName = keyof typeof mapNodeTypes;

export const mapNodeTypes: Record<string, MapNodeType> = {
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