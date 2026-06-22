import type { ReactNode } from "react";
import "./SpToolbar.css";
import { NavigationContext, useNavigationGroup } from "../../contexts";

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
  const { navAttrs, navigation } = useNavigationGroup();
  return (
    <div
      className={`toolbar ${className}`}
      role="toolbar"
      aria-label={ariaLabel}
      {...navAttrs}
    >
      <NavigationContext value={navigation}>{children}</NavigationContext>
    </div>
  );
};
