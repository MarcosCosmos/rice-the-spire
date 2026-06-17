import { useEffect, type ReactNode } from "react";
import "./SpMenuBar.css";
import { NavigationContext } from "../../contexts";
export const SpMenuBar = ({
  className,
  children,
  ...attrs
}: { className?: string; children: ReactNode } & Record<string, unknown>) => {
  useEffect(() => {
    NavigationContext.start();
    return () => { NavigationContext.stop(); };
  }, []);
  className ??= "";
  return (
    <div className={`menubar ${className}`} role="menubar" {...attrs}>
      {children}
    </div>
  );
};
