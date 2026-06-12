import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import Workspaces from "../Workspaces";
import GlazeWorkspace from "../GlazeWorkspace";
const GlazeWorkspaces = () => {
  const zebar = useContext(ZebarContext);
  return (
    zebar?.glazewm && (
      <Workspaces>
        {zebar.glazewm.currentWorkspaces?.map((data) => (
          <GlazeWorkspace key={data.name} data={data} />
        ))}
      </Workspaces>
    )
  );
};

export default GlazeWorkspaces;
