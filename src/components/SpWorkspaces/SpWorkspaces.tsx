/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useContext, type CSSProperties } from "react";
import SpireContext from "../../contexts/SpireContext";
import "./SpWorkspaces.css";
import {
  graphicHeight,
  graphicWidth,
  maxNodeHeight,
  maxNodeWidth,
  SpWorkspace,
  type SpWorkspaceProps,
} from "../SpWorkspace";
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
  const style: CSSProperties = {
    "--max-node-height": `${maxNodeHeight}px`,
    "--max-node-width": `${maxNodeWidth}px`,
    "--graphic-width": `${graphicWidth}px`,
    "--graphic-height": `${graphicHeight}px`,
  } as CSSProperties;
  return (
    <nav
      tabIndex={-1}
      className={`workspaces workspaces--${config.act} ${className}`}
      style={style}
    >
      <div
        className="workspaces__content anchor-tooltips-block-start"
        role="tablist"
        aria-label="Workspaces"
        {...navAttrs}
      >
        {workspaces.map(({ key, ...props }, index) => (
          <SpWorkspace
            key={key}
            className={
              index <= 1
                ? "anchor-tooltips-inline-start"
                : index >= workspaces.length - 2
                  ? "anchor-tooltips-inline-end"
                  : undefined
            }
            {...props}
          />
        ))}
      </div>
    </nav>
  );
};
