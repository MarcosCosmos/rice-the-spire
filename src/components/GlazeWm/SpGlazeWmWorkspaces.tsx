import type { SpWorkspaceConfig } from "../SpWorkspace";
import { SpWorkspaces } from "../SpWorkspaces/SpWorkspaces";
import useGlazeWmWorkspaces from "./useGlazeWmWorkspaces";
export interface SpGlazeWmWorkspacesProps {
  className?: string;
  sourceSet?: "current" | "all";
  configMap?: Record<string, SpWorkspaceConfig>;
  /**
   * Roughly corresponds to GlazeWM's keep-alive but over all workspaces: will show on the bar even if glazewm doesn't report it.
   */
  showAlways: boolean;
}
export const SpGlazeWmWorkspaces = ({
  className,
  sourceSet,
  configMap,
  showAlways,
}: SpGlazeWmWorkspacesProps) => {
  const workspaces = useGlazeWmWorkspaces(sourceSet, configMap, showAlways);
  if (workspaces) {
    return <SpWorkspaces className={className} workspaces={workspaces} />;
  }
};
export default SpGlazeWmWorkspaces;
