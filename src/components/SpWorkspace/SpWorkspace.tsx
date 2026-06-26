/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  useState,
  useEffect,
  type CSSProperties,
  type MouseEventHandler,
} from "react";
import { MapNodeGraphic } from "./MapNodeGraphic";
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
import SpItemLabel from "../SpItemLabel";
import SpTooltip from "../SpTooltip";

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
              path={path}
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
              <SpItemLabel>{displayName}</SpItemLabel>
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
