import { useContext } from "react";
import SpireContext from "../../contexts/SpireContext";
import "./SpWorkspaces.css";
import { SpWorkspace, type SpWorkspaceProps } from "../SpWorkspace";
import { useNavigationGroup } from "../../contexts";

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
  const navAttrs = useNavigationGroup();
  return (
    <nav
      tabIndex={-1}
      className={`workspaces workspaces--${config.act} anchor-tooltips-block-start ${className}`}
    >
      <div
        className="workspaces__content"
        role="tablist"
        aria-label="Workspaces"
        {...navAttrs}
      >
        {workspaces.map(({ key, ...props }) => (
          <SpWorkspace key={key} {...props} />
        ))}
      </div>
    </nav>
  );
};
