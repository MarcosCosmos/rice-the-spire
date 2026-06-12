import { useState, useEffect, useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpireContext from "../../data/SpireContext";
import useClassFilter from "../../util/useClassFilter";
import SpMenuItem from "../SpMenuItem";
import SpOutlinedText from "../SpOutlinedText";
import MapNodeGraphic from "./MapNodeGraphic";
import resolveSpireImage from "../../util/resolveSpireImage";
import { mapNodeTypes, randomisableNodes } from "./common";

const Workspace = ({ className, data, ...attrs }) => {
  const [nodeType, setNodeType] = useState("unknown");
  const zebar = useContext(ZebarContext);
  let { name, displayName, hasFocus, isDisplayed, children } = data;

  useEffect(() => {
    const result =
      randomisableNodes[Math.floor(Math.random() * randomisableNodes.length)];
    setNodeType(result);
  }, [name]);

  className ||= "";
  displayName ||= name;
  const isEmpty = !children || children.length === 0;
  const workspaceDesc = `Workspace: ${displayName}; empty: ${isEmpty}; focused: ${hasFocus}; displayed: ${isDisplayed}.`;
  const filteredClasses = useClassFilter({
    "workspace--focused": hasFocus,
    "workspace--displayed": isDisplayed,
    "workspace--empty": isEmpty,
  });

  return (
    <SpMenuItem
      className={`workspace workspace--${nodeType} ${filteredClasses} ${className}`}
      tooltip={workspaceDesc}
      {...attrs}
    >
      <MapNodeGraphic
        nodeType={nodeType}
        isEmpty={isEmpty}
        isDisplayed={isDisplayed}
        hasFocus={hasFocus}
      />
      <SpOutlinedText className="item-label">{displayName || name}</SpOutlinedText>
    </SpMenuItem>
  );
};

export default Workspace;
