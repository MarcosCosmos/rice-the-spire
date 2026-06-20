import { useContext } from "react";
import { type Workspace } from "glazewm";
import ZebarContext from "../../contexts/ZebarContext";
import SpWorkspace from "../SpWorkspace";
export interface SpGlazeWorkspaceProps {
  data: Workspace;
}

export const SpGlazeWorkspace = ({ data, ...attrs }: SpGlazeWorkspaceProps) => {
  const zebar = useContext(ZebarContext);
  const onClick = () => {
    void zebar?.glazewm?.runCommand(`focus --workspace ${data.name}`);
  };

  const displayName = data.displayName || data.name;
  const hasChildren = data.children.length > 0;
  const { isDisplayed, hasFocus } = data;

  return (
    <SpWorkspace
      className="glazewm-workspace"
      data={{ displayName, hasChildren, isDisplayed, hasFocus }}
      onClick={onClick}
      {...attrs}
    />
  );
};
