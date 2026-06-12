import type { ReactNode } from "react";

export interface BarProps extends Record<string, any> {
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}

const Bar = ({ className, ariaLabel, children, ...attrs }: BarProps) => {
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

export default Bar;
