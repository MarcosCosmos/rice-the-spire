import { SpWorkspaces } from "../SpWorkspaces/SpWorkspaces";
import useGlazeWmWorkspaces from "./useGlazeWmWorkspaces";
export interface SpGlazeWmWorkspacesProps {
  className?: string;
  set?: "current" | "all";
}
export const SpGlazeWmWorkspaces = ({
  className,
  set,
}: SpGlazeWmWorkspacesProps) => {
  const workspaces = useGlazeWmWorkspaces(set);
  if (workspaces) {
    return <SpWorkspaces className={className} workspaces={workspaces} />;
  }
};
export default SpGlazeWmWorkspaces;
