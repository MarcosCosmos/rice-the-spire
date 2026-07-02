import {
  type CSSProperties,
  type DetailedHTMLProps,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import "./SpMenuBar.css";
import { resolveSpireImage } from "../../util";
export interface SpMenuBarProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  className?: string;
  children: ReactNode;
}

const backgroundImage = `url(${resolveSpireImage("ui/top_bar/top_bar")})`;

/**
 * Not actually an aria menubar, which would not be advantageous since the app has the role app anyway
 * @param param
 * @returns
 */
export const SpMenuBar = ({
  className,
  children,
  ...attrs
}: SpMenuBarProps) => {
  className ??= "";

  const style: CSSProperties = {
    backgroundImage,
  };
  return (
    <div className={`sp-menubar ${className}`} style={style} {...attrs}>
      <div className="sp-menubar__content">{children}</div>
    </div>
  );
};
