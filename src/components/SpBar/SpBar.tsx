import type { ReactNode } from "react";

export interface SpBarProps extends Record<string, any> {
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}

const SpBar = ({ className, ariaLabel, children, ...attrs }: SpBarProps) => {
  className ||= "";
  if (attrs["aria-label"]) {
    attrs = {
      role: "region",
      ...attrs,
    };
  }

  return (
    <div className={`bar ${className}`} {...attrs}>
      {children}
    </div>
  );
};

export default SpBar;
