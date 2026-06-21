import { useContext } from "react";
import SpireContext from "../../contexts/SpireContext";
import "./SpWorkspaces.css";
import { SpWorkspace, type SpWorkspaceProps } from "../SpWorkspace";

export interface WorkspaceProps extends SpWorkspaceProps {
  key: string;
}
export interface SpWorkspacesProps {
  className?: string;
  workspaces: WorkspaceProps[];
}

export const SpWorkspaces = ({ className, workspaces }: SpWorkspacesProps) => {
  className ??= "";
  const config = useContext(SpireContext);
  return (
    <div
      className={`workspaces workspaces--${config.act} anchor-tooltips-block-start ${className}`}
      role="tablist"
      aria-label="Workspaces"
    >
      <div className="workspaces__content">{workspaces.map(SpWorkspace)}</div>
    </div>
  );
};
