import { useContext } from "react";
import { ZebarContext } from "../../contexts";
import type { WorkspaceProps } from "../SpWorkspaces/SpWorkspaces";
import type { SpWorkspaceConfig } from "../SpWorkspace";
import type { Workspace } from "glazewm";

interface MixedWorkspaceConfigType
  extends SpWorkspaceConfig, Partial<Workspace> {
  name: string;
}

export const useGlazeWmWorkspaces = (
  sourceSet?: "current" | "all",
  configMap?: Record<string, SpWorkspaceConfig>,
  /**
   * Roughly corresponds to GlazeWM's keep-alive but over all workspaces: will show on the bar even if glazewm doesn't report it.
   */
  showAlways?: boolean,
): WorkspaceProps[] | undefined => {
  sourceSet ??= "current";
  const glazewm = useContext(ZebarContext)?.glazewm;
  if (glazewm) {
    const source =
      sourceSet === "current"
        ? glazewm.currentWorkspaces
        : glazewm.allWorkspaces;

    // we don't need to pre-empt any workspaces that genuinely exist,
    // and would not want to in case they are on a different monitor (e.g. with sourceSet == current)
    const uninitialised: [string, MixedWorkspaceConfigType][] =
      showAlways && configMap
        ? [
            ...new Set(Object.keys(configMap))
              .difference(
                new Set(glazewm.allWorkspaces.map(({ name }) => name)),
              )
              .values()
              .map((name): [string, MixedWorkspaceConfigType] => [
                name,
                {
                  name,
                  ...configMap[name],
                },
              ]),
          ]
        : [];

    const resolvedEntries = new Map<string, MixedWorkspaceConfigType>([
      ...uninitialised,
      ...source.map((workspace): [string, MixedWorkspaceConfigType] => {
        const config = configMap?.[workspace.name];
        return [
          workspace.name,
          {
            ...workspace,
            ...config,
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            displayName: workspace.displayName ?? config?.displayName,
          },
        ];
      }),
    ]);

    // remove entries that are in the wrong set

    return [
      ...resolvedEntries
        .values()
        .map(
          ({
            name,
            displayName,
            hasFocus,
            isDisplayed,
            children,
            nodeKind,
          }) => ({
            key: name,
            // glazewm is typed incorrectly here
            displayName: displayName ?? name,
            hasFocus: !!hasFocus,
            isDisplayed: !!isDisplayed,
            hasChildren: (children?.length ?? 0) > 0,
            nodeKind,
            onClick: () => {
              void glazewm.runCommand(`focus --workspace ${name}`);
            },
          }),
        ),
    ];
  }
};
export default useGlazeWmWorkspaces;
