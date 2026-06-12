import { useContext } from "react";
import { type Workspace } from "glazewm";
import ZebarContext from "../../data/ZebarContext";
import SpWorkspace from "../SpWorkspace";
export interface SpGlazeWorkspaceProps extends Record<string, any> {
  data: Workspace;
}

const SpGlazeWorkspace = ({ data, ...attrs } : SpGlazeWorkspaceProps) => {
  const zebar = useContext(ZebarContext);
  const onClick = () =>
    zebar?.glazewm?.runCommand(`focus --workspace ${data.name}`);

  return (
    <SpWorkspace
      className="glazewm-workspace"
      data={data}
      onClick={onClick}
      {...attrs}
    />
  );
};

export default SpGlazeWorkspace;
