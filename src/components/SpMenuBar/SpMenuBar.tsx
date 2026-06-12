import type { ReactNode } from "react";
import "./SpMenuBar.css";
export default ({
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
