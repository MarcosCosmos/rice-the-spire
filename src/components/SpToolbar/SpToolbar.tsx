import type { ReactNode } from "react";
import "./SpToolbar.css";
import { useNavigationGroup } from "../../contexts";

export interface SpRegionProps {
  className?: string;
  "aria-label": string;
  children: ReactNode;
}

export const SpToolbar = ({
  className,
  "aria-label": ariaLabel,
  children,
}: SpRegionProps) => {
  className ??= "";
  const navAttrs = useNavigationGroup();
  return (
    <div
      className={`toolbar ${className}`}
      role="toolbar"
      aria-label={ariaLabel}
      {...navAttrs}
    >
      {children}
    </div>
  );
};
