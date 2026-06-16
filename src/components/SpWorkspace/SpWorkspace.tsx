import { useState, useEffect } from "react";
import useClassFilter from "../../util/useClassFilter";
import SpMenuItem from "../SpMenuItem";
import { MapNodeGraphic } from "./MapNodeGraphic";
import { randomisableNodes } from "./common";
import SpItemLabel from "../SpItemLabel";
import "./SpWorkspace.css";
import SpTooltip from "../SpTooltip";

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

export const SpWorkspace = ({
  className,
  data,
  ...attrs
}: SpWorkspaceProps) => {
  const [nodeType, setNodeType] = useState("unknown");
  let { displayName, hasFocus, isDisplayed, hasChildren } = data;

  useEffect(() => {
    const result =
      randomisableNodes[Math.floor(Math.random() * randomisableNodes.length)];
    setNodeType(result);
  }, [displayName]);

  className ||= "";
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

  const anchor = (tooltipId: string) => (
    <div className="workspace-shrinkwrap">
      <MapNodeGraphic
        nodeType={nodeType}
        hasChildren={hasChildren}
        isDisplayed={isDisplayed}
        hasFocus={hasFocus}
      />
      <SpMenuItem
        className={`workspace workspace--${nodeType} ${filteredClasses} ${className}`}
        aria-label={label}
        aria-describedby={tooltipId}
        {...attrs}
      >
        <SpItemLabel>{displayName}</SpItemLabel>
      </SpMenuItem>
    </div>
  );

  return <SpTooltip anchor={anchor}>{tooltip}</SpTooltip>;
};
