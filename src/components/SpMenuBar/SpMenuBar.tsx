import type { ReactNode } from "react";
import "./SpMenuBar.css";
const SpMenuBar = ({
  className,
  children,
  ...attrs
}: { className?: string; children: ReactNode } & Record<string, any>) => {
  className ||= "";
  return (
    <div className={`menubar ${className}`} role="menubar" {...attrs}>
      {children}
    </div>
  );
};
export default SpMenuBar;
