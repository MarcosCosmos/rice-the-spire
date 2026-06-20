/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useState, useEffect, type CSSProperties } from "react";
import useClassFilter from "../../util/useClassFilter";
import SpMenuItem, { type SpMenuItemProps } from "../SpMenuItem";
import { MapNodeGraphic } from "./MapNodeGraphic";
import {
  graphicHeight,
  graphicWidth,
  mapNodeTypes,
  maxNodeHeight,
  maxNodeWidth,
  randomisableNodes,
} from "./common";
import SpItemLabel from "../SpItemLabel";
import "./SpWorkspace.css";
import SpTooltip from "../SpTooltip";
export interface SimplifiedWorkspaceInfo {
  displayName: string;
  hasFocus: boolean;
  isDisplayed: boolean;
  hasChildren: boolean;
}

export interface SpWorkspaceProps extends SpMenuItemProps {
  data: SimplifiedWorkspaceInfo;
}

export const SpWorkspace = ({
  className,
  data,
  ...attrs
}: SpWorkspaceProps) => {
  const [baseNodeType, setBaseNodeType] = useState("unknown");

  const [isVisited, setVisited] = useState(false);
  const { displayName, hasFocus, isDisplayed, hasChildren } = data;

  useEffect(() => {
    if (!isVisited && isDisplayed) {
      setVisited(true);
    }
  }, [isVisited, isDisplayed]);

  useEffect(() => {
    if (!isVisited && isDisplayed) {
      setVisited(true);
    }
  }, [isVisited, isDisplayed]);

  useEffect(() => {
    const result =
      randomisableNodes[Math.floor(Math.random() * randomisableNodes.length)];
    setBaseNodeType(result);
  }, [displayName]);

  let renderedNodeType, path;
  if (!hasChildren) {
    if (isVisited) {
      renderedNodeType = baseNodeType;
      path = `unknown_${baseNodeType}`;
    } else {
      renderedNodeType = "unknown";
      path = renderedNodeType;
    }
  } else {
    renderedNodeType = baseNodeType;
    path = baseNodeType;
  }
  const renderedNodeDetails = mapNodeTypes[renderedNodeType];

  className ??= "";
  const label = `Workspace ${displayName}`;
  const tooltip = (
    <>
      <h2>Workspace state: </h2>
      {hasFocus ? <em>focused</em> : <>unfocused</>},{" "}
      {isDisplayed ? <em>visible</em> : <>hidden</>},{" "}
      {hasChildren ? <em>filled</em> : <>empty</>}
    </>
  );
  const filteredClasses = useClassFilter({
    "workspace--focused": hasFocus,
    "workspace--displayed": isDisplayed,
    "workspace--empty": !hasChildren,
  });

  const style: CSSProperties = {
    "--max-node-height": `${maxNodeHeight}px`,
    "--max-node-width": `${maxNodeWidth}px`,
    "--graphic-width": `${graphicWidth}px`,
    "--graphic-height": `${graphicHeight}px`,
    "--node-width": `${renderedNodeDetails.width}px`,
    "--node-height": `${renderedNodeDetails.height}px`,
  } as CSSProperties;

  const anchor = (tooltipId: string) => (
    <>
      <MapNodeGraphic
        details={renderedNodeDetails}
        path={path}
        isDisplayed={isDisplayed}
        hasFocus={hasFocus}
      />
      <SpMenuItem
        className={`workspace workspace--${baseNodeType} ${filteredClasses} ${className}`}
        aria-label={label}
        aria-describedby={tooltipId}
        {...attrs}
      >
        <SpItemLabel>{displayName}</SpItemLabel>
      </SpMenuItem>
    </>
  );

  return (
    <SpTooltip anchor={anchor} className="workspace-shrinkwrap" style={style}>
      {tooltip}
    </SpTooltip>
  );
};
