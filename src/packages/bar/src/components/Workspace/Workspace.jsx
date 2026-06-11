import { useState, useEffect, useContext } from 'react';
import ZebarContext from '../../data/ZebarContext';
import SpireContext from '../../data/SpireContext';
import { MenuItem, OutlinedText } from '../';
import useClassFilter from '../../util/useClassFilter';
import { resolveSpireImage } from '../SpireImage/SpireImage';

const mapNodeTypes = {
  monster: { width: 66, height: 68, obvious: false },
  elite: { width: 89, height: 70, obvious: false },
  shop: { width: 69, height: 72, obvious: false },
  chest: { width: 84, height: 59, obvious: false },
  rest: { width: 61, height: 90, obvious: true },
  unknown: { width: 73, height: 72, obvious: true },
};

const mapMarkerDetails = {
  width: 49,
  height: 64,
};

const randomisableNodes = Object.entries(mapNodeTypes)
  .filter(([, details]) => !details.obvious)
  .map(([key]) => key);

const Workspace = ({ className, data, ...attrs }) => {
  const [nodeType, setNodeType] = useState('unknown');
  const zebar = useContext(ZebarContext);
  let { name, displayName, hasFocus, isDisplayed, children } = data;

  useEffect(() => {
    const result = randomisableNodes[Math.floor(Math.random() * randomisableNodes.length)];
    setNodeType(result);
  }, [name]);

  className ||= '';
  displayName ||= name;
  const isEmpty = !children || children.length === 0;
  const workspaceDesc = `Workspace: ${displayName}; empty: ${isEmpty}; focused: ${hasFocus}; displayed: ${isDisplayed}.`;
  const filteredClasses = useClassFilter({
    'workspace--focused': hasFocus,
    'workspace--displayed': isDisplayed,
    'workspace--empty': isEmpty,
  });

  return (
    <MenuItem
      className={`workspace workspace--${nodeType} ${filteredClasses} ${className}`}
      tooltip={workspaceDesc}
      {...attrs}
    >
      <MapNodeGraphic nodeType={nodeType} isEmpty={isEmpty} isDisplayed={isDisplayed} hasFocus={hasFocus} />
      <OutlinedText className="item-label">{displayName || name}</OutlinedText>
    </MenuItem>
  );
};

const MapNodeGraphic = ({ nodeType, isEmpty, isDisplayed, hasFocus }) => {
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
      nodeType = 'unknown';
      path = nodeType;
    }
  } else {
    path = nodeType;
  }

  const nodeX = -details.width / 2;
  const nodeY = -details.height / 2;
  const markerY = -((details.height / 2) + mapMarkerDetails.height + 2);
  const maxNodeWidth = Math.max(...randomisableNodes.map(key => mapNodeTypes[key].width));
  const maxNodeHeight = Math.max(...randomisableNodes.map(key => mapNodeTypes[key].height));
  const maxDimension = Math.max(maxNodeWidth, maxNodeHeight);
  const circleRatio = 0.9;
  const circleRadius = maxDimension * circleRatio;
  const circleStrokeWidth = (2 / 7) * circleRadius;
  const radiusWithStroke = circleRadius + circleStrokeWidth;
  const graphicWidth = 2 * radiusWithStroke;
  const graphicHeight = radiusWithStroke + Math.max(radiusWithStroke, maxNodeHeight / 2 + mapMarkerDetails.height + 2);
  const halfWidth = graphicWidth / 2;
  const midPoint = 0;
  const pathLength = 2 * Math.PI * circleRadius * 0.9;
  const markerX = -mapMarkerDetails.width / 2;

  const style = {
    '--width-scale': `${graphicWidth / maxDimension}`,
    '--height-scale': `${graphicHeight / maxDimension}`,
    '--width-offset': `${radiusWithStroke / maxDimension}`,
    '--height-offset': `${details.height / maxDimension}`,
  };

  return (
    <svg className="map-node-graphic" viewBox={`-${halfWidth} -${halfWidth} ${graphicWidth} ${graphicHeight}`} style={style}>
      {isDisplayed && <circle cx={midPoint} cy={midPoint} r={circleRadius} strokeWidth={circleStrokeWidth} strokeDasharray={`${pathLength}px`} />}
      <image href={resolveSpireImage(`ui/map_nodes/map_${path}`)} x={nodeX} y={nodeY} width={details.width} height={details.height} />
      {hasFocus && <image href={resolveSpireImage(`ui/map/map_marker_${config.character}`)} x={markerX} y={markerY} width={mapMarkerDetails.width} height={mapMarkerDetails.height} />}
    </svg>
  );
};

export default Workspace;
