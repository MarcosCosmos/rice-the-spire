import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpWorkspace from "../SpWorkspace";
export interface GlazeWorkspaceProps extends Record<string, any> {
  data: Workspace;
}

const GlazeWorkspace = ({ data, ...attrs }) => {
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

export default GlazeWorkspace;
