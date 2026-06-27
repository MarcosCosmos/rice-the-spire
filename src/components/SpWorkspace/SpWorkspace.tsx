/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  useState,
  useEffect,
  type CSSProperties,
  type MouseEventHandler,
} from "react";
import { MapNodeGraphic } from "./BackgroundGraphic";
import {
  graphicHeight,
  graphicWidth,
  mapNodeTypes,
  maxNodeHeight,
  maxNodeWidth,
  randomisableNodes,
} from "./common";
import "./SpWorkspace.css";
import { SpButton, type SpButtonProps } from "../SpButton/SpButton";
import SpTooltip from "../SpTooltip";
import SpPower from "../SpPower";

export interface SpWorkspaceProps extends SpButtonProps {
  className?: string;
  disabled?: boolean;
  displayName: string;
  hasFocus: boolean;
  isDisplayed: boolean;
  hasChildren: boolean;
  onClick: MouseEventHandler;
}

export const SpWorkspace = ({
  className,
  displayName,
  hasFocus,
  isDisplayed,
  hasChildren,
  ...attrs
}: SpWorkspaceProps) => {
  className ??= "";
  const [baseNodeType, setBaseNodeType] = useState("unknown");

  const [isVisited, setVisited] = useState(false);

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

  let renderedNodeType, fileName;
  if (!hasChildren) {
    if (isVisited) {
      renderedNodeType = baseNodeType;
      fileName = `unknown_${baseNodeType}`;
    } else {
      renderedNodeType = "unknown";
      fileName = renderedNodeType;
    }
  } else {
    renderedNodeType = baseNodeType;
    fileName = baseNodeType;
  }
  const path = `ui/map_nodes/map_${fileName}`;
  const renderedNodeDetails = mapNodeTypes[renderedNodeType];

  const label = `Workspace ${displayName}`;
  const style: CSSProperties = {
    "--max-node-height": `${maxNodeHeight}px`,
    "--max-node-width": `${maxNodeWidth}px`,
    "--graphic-width": `${graphicWidth}px`,
    "--graphic-height": `${graphicHeight}px`,
    "--node-width": `${renderedNodeDetails.width}px`,
    "--node-height": `${renderedNodeDetails.height}px`,
  } as CSSProperties;

  return (
    <div className={`workspace ${className}`}>
      <SpTooltip
        anchor={(tooltipId: string) => (
          <div className="workspace-shrinkwrap" style={style}>
            <MapNodeGraphic
              details={renderedNodeDetails}
              path={fileName}
              isDisplayed={isDisplayed}
              hasFocus={hasFocus}
            />
            <SpButton
              className={`workspace__button`}
              role="tab"
              aria-selected={isDisplayed}
              aria-label={label}
              aria-describedby={tooltipId}
              {...attrs}
            >
              <SpPower path={path}>{displayName}</SpPower>
            </SpButton>
          </div>
        )}
        desc={
          <>
            <h2>Workspace: </h2>
            {hasFocus ? <em>focused</em> : <>unfocused</>},{" "}
            {isDisplayed ? <em>visible</em> : <>hidden</>},{" "}
            {hasChildren ? <em>filled</em> : <>empty</>}
          </>
        }
      />
    </div>
  );
};
