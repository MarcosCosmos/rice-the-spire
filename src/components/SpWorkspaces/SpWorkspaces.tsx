/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useContext, type CSSProperties } from "react";
import SpireContext from "../../contexts/SpireContext";
import "./SpWorkspaces.css";
import {
  SpWorkspace,
  useMapGeometry,
  type SpWorkspaceProps,
} from "../SpWorkspace";
import { useNavigationGroup } from "../../contexts";
import { resolveSpireImage } from "../../util";

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
  const mapGeometry = useMapGeometry();

  const backgroundImage = `url(${resolveSpireImage("ui/map_backgrounds/map_middle_" + config.act)})`;
  if (mapGeometry) {
    const style: CSSProperties = {
      "--max-node-width": `${mapGeometry.maxNode.width}px`,
      "--max-node-height": `${mapGeometry.maxNode.height}px`,
      "--graphic-width": `${mapGeometry.graphic.width}px`,
      "--graphic-height": `${mapGeometry.graphic.height}px`,
      backgroundImage,
    } as CSSProperties;
    return (
      <nav tabIndex={-1} className={`sp-workspaces ${className}`} style={style}>
        <div
          className="sp-workspaces__content anchor-tooltips-block-start"
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
  }
};
