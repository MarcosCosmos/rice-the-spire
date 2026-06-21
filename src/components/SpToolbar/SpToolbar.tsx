import type { ReactNode } from "react";
import "./SpToolbar.css";

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
  return (
    <div
      className={`toolbar ${className}`}
      role="toolbar"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};
