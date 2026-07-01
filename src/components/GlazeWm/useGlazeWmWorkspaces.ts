import { useContext } from "react";
import { ZebarContext } from "../../contexts";
import type { WorkspaceProps } from "../SpWorkspaces/SpWorkspaces";

export const useGlazeWmWorkspaces = (
  set?: "current" | "all",
): WorkspaceProps[] | undefined => {
  set ??= "current";
  const glazewm = useContext(ZebarContext)?.glazewm;
  if (glazewm) {
    const source =
      set === "current" ? glazewm.currentWorkspaces : glazewm.allWorkspaces;
    return source.map(
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
export default useGlazeWmWorkspaces;
