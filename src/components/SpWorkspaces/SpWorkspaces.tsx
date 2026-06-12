import { useContext, type ReactNode } from "react";
import SpireContext from "../../data/SpireContext";
import "./SpWorkspaces.css";

export interface SpWorkspacesProps {
  className?: string;
  children: ReactNode;
}

const SpWorkspaces = ({ className, children, ...attrs }: SpWorkspacesProps) => {
  className ||= "";
  const config = useContext(SpireContext);
  return (
    <div
      className={`workspaces workspaces--${config.act} ${className}`}
      role="region"
      aria-label={"Workspaces"}
      {...attrs}
    >
      <div className="workspaces__content">{children}</div>
    </div>
  );
};

export default SpWorkspaces;
