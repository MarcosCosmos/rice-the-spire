import { useContext } from "react";
import ZebarContext from "../../data/ZebarContext";
import SpWorkspaces from "../SpWorkspaces";
import SpGlazeWorkspace from "../SpGlazeWorkspace";
const SpSpGlazeWorkspaces = () => {
  const zebar = useContext(ZebarContext);
  return (
    zebar?.glazewm && (
      <Workspaces>
        {zebar.glazewm.currentWorkspaces?.map((data) => (
          <SpGlazeWorkspace key={data.name} data={data} />
        ))}
      </Workspaces>
    )
  );
};

export default SpSpGlazeWorkspaces;
