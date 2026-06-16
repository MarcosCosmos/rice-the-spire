import type { ReactNode } from "react";
import "./SpRegion.css";

export interface SpRegionProps {
  className?: string;
  "aria-label": string;
  children: ReactNode;
}

export const SpRegion = ({
  className,
  "aria-label": ariaLabel,
  children,
}: SpRegionProps) => {
  className ||= "";
  return (
    <div className={`region ${className}`} role="region" aria-label={ariaLabel}>
      {children}
    </div>
  );
};
