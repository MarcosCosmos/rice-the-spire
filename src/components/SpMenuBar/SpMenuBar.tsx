import {
  type DetailedHTMLProps,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import "./SpMenuBar.css";
export interface SpMenuBarProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  className?: string;
  children: ReactNode;
}
export const SpMenuBar = ({
  className,
  children,
  ...attrs
}: SpMenuBarProps) => {
  className ??= "";
  return (
    <div className={`menubar ${className}`} role="application" {...attrs}>
      <div className="menubar__background" />
      <div className="menubar__content">{children}</div>
    </div>
  );
};
