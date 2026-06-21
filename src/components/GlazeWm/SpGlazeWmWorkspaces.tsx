import { useContext } from "react";
import { ZebarContext } from "../../contexts";
import {
  SpWorkspaces,
  type WorkspaceProps,
} from "../SpWorkspaces/SpWorkspaces";

export const useGlazeWmWorkspaces = (): WorkspaceProps[] | undefined => {
  const glazewm = useContext(ZebarContext)?.glazewm;
  if (glazewm) {
    return glazewm.currentWorkspaces.map(
      ({ name, displayName, hasFocus, isDisplayed, children }) => ({
        key: name,
        // glazewm is typed incorrectly here
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        displayName: displayName ?? name,
        hasFocus,
        isDisplayed,
        hasChildren: children.length > 0,
        onClick: () => {
          void glazewm.runCommand(`focus --workspace ${name}`);
        },
      }),
    );
  }
};

export const SpGlazeWmWorkspaces = ({ className }: { className?: string }) => {
  const workspaces = useGlazeWmWorkspaces();
  if (workspaces) {
    return <SpWorkspaces className={className} workspaces={workspaces} />;
  }
};
export default SpGlazeWmWorkspaces;
