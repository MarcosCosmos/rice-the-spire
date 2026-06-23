import { SpWorkspaces } from "../SpWorkspaces/SpWorkspaces";
import useGlazeWmWorkspaces from "./useGlazeWmWorkspaces";
export const SpGlazeWmWorkspaces = ({ className }: { className?: string }) => {
  const workspaces = useGlazeWmWorkspaces();
  if (workspaces) {
    return <SpWorkspaces className={className} workspaces={workspaces} />;
  }
};
export default SpGlazeWmWorkspaces;
