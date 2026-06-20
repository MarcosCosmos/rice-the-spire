import React, { useEffect, type ReactNode } from "react";
import "./SpMenuBar.css";
import { NavigationContext } from "../../contexts";
export interface SpMenuBarProps extends React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
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
  useEffect(() => {
    NavigationContext.start();
    return () => {
      NavigationContext.stop();
    };
  }, []);
  className ??= "";
  return (
    <div className={`menubar ${className}`} role="menubar" {...attrs}>
      <div className="menubar__background" />
      <div className="menubar__content">{children}</div>
    </div>
  );
};
