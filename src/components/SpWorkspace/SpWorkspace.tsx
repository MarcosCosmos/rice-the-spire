/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useState, useEffect, type CSSProperties } from "react";
import { SpWorkspaceBackgroundGraphic } from "./SpWorkspaceBackgroundGraphic";
import { hiddenNodes, useMapGeometry, type MapNodeKind } from "./common";
import "./SpWorkspace.css";
import { SpButton, type SpButtonProps } from "../SpButton/SpButton";
import SpTooltip from "../SpTooltip";
import SpPower from "../SpPower";

/**
 * For prefilling workspaces that haven't been reported by the WM yet (similar to the feature available for binding modes).
 * Will always get matched against live data from the WM if available.
 * It allows allows you to set the node kind/icon (leave blank for randomly revealed from unknown, if you manually set unknown it will not randomise)
 */
export interface SpWorkspaceConfig {
  displayName?: string;
  nodeKind?: MapNodeKind;
}

export interface SpWorkspaceProps extends SpWorkspaceConfig, SpButtonProps {
  className?: string;
  hasFocus: boolean;
  isDisplayed: boolean;
  hasChildren: boolean;
}

export const SpWorkspace = ({
  className,
  displayName,
  nodeKind,
  hasFocus,
  isDisplayed,
  hasChildren,
  ...attrs
}: SpWorkspaceProps) => {
  className ??= "";
  const mapGeometry = useMapGeometry();
  console.log(displayName, nodeKind);
  const [underlyingNodeKind, setUnderlyingNodeKind] = useState<MapNodeKind>(
    nodeKind ?? "unknown",
  );
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
    setUnderlyingNodeKind(
      nodeKind ?? hiddenNodes[Math.floor(Math.random() * hiddenNodes.length)],
    );
    if (nodeKind) {
      setVisited(true); // disable the hidden state
    }
  }, [displayName, nodeKind]);

  if (mapGeometry) {
    let renderedNodeKind: MapNodeKind, fileName;
    if (!hasChildren) {
      if (isVisited) {
        renderedNodeKind = underlyingNodeKind;
        fileName = `unknown_${underlyingNodeKind}`;
      } else {
        renderedNodeKind = "unknown";
        fileName = renderedNodeKind;
      }
    } else {
      renderedNodeKind = underlyingNodeKind;
      fileName = underlyingNodeKind;
    }
    const path = `ui/map_nodes/map_${fileName}`;
    const renderedNodeDetails = mapGeometry.images[renderedNodeKind];

    const label = `Workspace ${displayName}`;
    const style: CSSProperties = {
      "--node-width": `${renderedNodeDetails.width}px`,
      "--node-height": `${renderedNodeDetails.height}px`,
    } as CSSProperties;

    return (
      <div className={`sp-workspace ${className}`}>
        <SpTooltip
          anchor={(tooltipId: string) => (
            <div className="sp-workspace__shrinkwrap" style={style}>
              <SpWorkspaceBackgroundGraphic
                isDisplayed={isDisplayed}
                hasFocus={hasFocus}
              />
              <SpButton
                className={`sp-workspace__button`}
                role="tab"
                aria-selected={isDisplayed}
                aria-label={label}
                aria-describedby={tooltipId}
                {...attrs}
              >
                <SpPower className="sp-workspace__power" path={path}>
                  {displayName}
                </SpPower>
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
  }
};
