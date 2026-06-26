import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import "./SpToolbar.css";
import { useNavigationGroup } from "../../contexts";

export interface SpRegionProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  className?: string;
  "aria-label": string;
  children: ReactNode;
}

export const SpToolbar = ({
  className,
  "aria-label": ariaLabel,
  children,
  ...attrs
}: SpRegionProps) => {
  className ??= "";
  const navAttrs = useNavigationGroup();
  return (
    <div
      className={`toolbar ${className}`}
      role="toolbar"
      aria-label={ariaLabel}
      {...navAttrs}
      {...attrs}
    >
      {children}
    </div>
  );
};
