import type { ReactNode } from "react";
import "./SpOutlinedText.css";

export interface SpOutlinedTextProps {
  className?: string;
  children: ReactNode;
}
export const SpOutlinedText = ({
  className,
  children,
  ...attrs
}: SpOutlinedTextProps) => {
  className ??= "";
  return (
    <span className={`outlined-text ${className}`} {...attrs}>
      <span className="outlined-text__foreground">{children}</span>
      <span className="outlined-text__background" aria-hidden="true">
        {children}
      </span>
    </span>
  );
};
