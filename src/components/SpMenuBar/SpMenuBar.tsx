import { useEffect, type ReactNode } from "react";
import "./SpMenuBar.css";
import { NavigationContext } from "../../contexts";
const SpMenuBar = ({
  className,
  children,
  ...attrs
}: { className?: string; children: ReactNode } & Record<string, any>) => {
  useEffect(() => {
    NavigationContext.start();
    return NavigationContext.stop;
  }, [])
  className ||= "";
  return (
    <div className={`menubar ${className}`} role="menubar" {...attrs}>
      {children}
    </div>
  );
};
export default SpMenuBar;
