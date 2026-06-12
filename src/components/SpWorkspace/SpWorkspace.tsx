import { useState, useEffect } from "react";
import useClassFilter from "../../util/useClassFilter";
import SpMenuItem from "../SpMenuItem";
import MapNodeGraphic from "./MapNodeGraphic";
import { randomisableNodes } from "./common";
import SpItemLabel from "../SpItemLabel";
import "./SpWorkspace.css";

export interface SimplifiedWorkspaceInfo {
  displayName: string;
  hasFocus: boolean;
  isDisplayed: boolean;
  hasChildren: boolean;
}

export interface SpWorkspaceProps extends Record<string, any> {
  className?: string;
  data: SimplifiedWorkspaceInfo;
}

const SpWorkspace = ({ className, data, ...attrs }: SpWorkspaceProps) => {
  const [nodeType, setNodeType] = useState("unknown");
  let { displayName, hasFocus, isDisplayed, hasChildren } = data;

  useEffect(() => {
    const result =
      randomisableNodes[Math.floor(Math.random() * randomisableNodes.length)];
    setNodeType(result);
  }, [displayName]);

  className ||= "";
  const workspaceDesc = `Workspace: ${displayName}; empty: ${!hasChildren}; focused: ${hasFocus}; displayed: ${isDisplayed}.`;
  const filteredClasses = useClassFilter({
    "workspace--focused": hasFocus,
    "workspace--displayed": isDisplayed,
    "workspace--empty": !hasChildren,
  });

  return (
    <SpMenuItem
      className={`workspace workspace--${nodeType} ${filteredClasses} ${className}`}
      tooltip={workspaceDesc}
      {...attrs}
    >
      <MapNodeGraphic
        nodeType={nodeType}
        isEmpty={!hasChildren}
        isDisplayed={isDisplayed}
        hasFocus={hasFocus}
      />
      <SpItemLabel>{displayName}</SpItemLabel>
    </SpMenuItem>
  );
};

export default SpWorkspace;
