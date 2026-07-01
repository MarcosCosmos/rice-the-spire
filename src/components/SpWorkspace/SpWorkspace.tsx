/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  useState,
  useEffect,
  type CSSProperties,
  type MouseEventHandler,
} from "react";
import { BackgroundGraphic } from "./BackgroundGraphic";
import { hiddenNodes, useMapGeometry, type MapNodeKind } from "./common";
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
  const mapGeometry = useMapGeometry();
  const [baseNodeType, setBaseNodeType] = useState<MapNodeKind>("unknown");
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
    const result = hiddenNodes[Math.floor(Math.random() * hiddenNodes.length)];
    setBaseNodeType(result);
  }, [displayName]);

  if (mapGeometry) {
    let renderedNodeKind: MapNodeKind, fileName;
    if (!hasChildren) {
      if (isVisited) {
        renderedNodeKind = baseNodeType;
        fileName = `unknown_${baseNodeType}`;
      } else {
        renderedNodeKind = "unknown";
        fileName = renderedNodeKind;
      }
    } else {
      renderedNodeKind = baseNodeType;
      fileName = baseNodeType;
    }
    const path = `ui/map_nodes/map_${fileName}`;
    const renderedNodeDetails = mapGeometry.images[renderedNodeKind];

    const label = `Workspace ${displayName}`;
    const style: CSSProperties = {
      "--node-width": `${renderedNodeDetails.width}px`,
      "--node-height": `${renderedNodeDetails.height}px`,
    } as CSSProperties;

    return (
      <div className={`workspace ${className}`}>
        <SpTooltip
          anchor={(tooltipId: string) => (
            <div className="workspace-shrinkwrap" style={style}>
              <BackgroundGraphic
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
  }
};
