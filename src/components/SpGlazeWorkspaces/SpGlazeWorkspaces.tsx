import { useContext } from "react";
import ZebarContext from "../../contexts/ZebarContext";
import SpWorkspaces from "../SpWorkspaces";
import SpGlazeWorkspace from "../SpGlazeWorkspace";
export const SpGlazeWorkspaces = () => {
  const zebar = useContext(ZebarContext);
  return (
    zebar?.glazewm && (
      <SpWorkspaces>
        {zebar.glazewm.currentWorkspaces?.map((data) => (
          <SpGlazeWorkspace key={data.name} data={data} />
        ))}
      </SpWorkspaces>
    )
  );
};
