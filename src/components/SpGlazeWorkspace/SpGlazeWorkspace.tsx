import { useContext } from "react";
import { type Workspace } from "glazewm";
import ZebarContext from "../../data/ZebarContext";
import SpWorkspace from "../SpWorkspace";
export interface SpGlazeWorkspaceProps {
  data: Workspace;
}

const SpGlazeWorkspace = ({ data, ...attrs }: SpGlazeWorkspaceProps) => {
  const zebar = useContext(ZebarContext);
  const onClick = () =>
    zebar?.glazewm?.runCommand(`focus --workspace ${data.name}`);

  const displayName = data.displayName || data.name;
  const hasChildren = data.children.length > 0;
  const { isDisplayed, hasFocus } = data;

  return (
    <SpWorkspace
      className="glazewm-workspace"
      data={{displayName, hasChildren, isDisplayed, hasFocus}}
      onClick={onClick}
      {...attrs}
    />
  );
};

export default SpGlazeWorkspace;
