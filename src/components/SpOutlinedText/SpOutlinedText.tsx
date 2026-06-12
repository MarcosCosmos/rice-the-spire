import type { ReactNode } from "react";
import "./SpOutlinedText.css";

export interface SpOutlinedTextProps {
  className?: string;
  children: ReactNode;
}
const SpOutlinedText = ({ className, children }: SpOutlinedTextProps) => {
  className ||= "";
  return (
    <span className={`outlined-text ${className}`}>
      <span className="outlined-text__foreground">{children}</span>
      <span className="outlined-text__background" aria-hidden="true">
        {children}
      </span>
    </span>
  );
};

export default SpOutlinedText;
