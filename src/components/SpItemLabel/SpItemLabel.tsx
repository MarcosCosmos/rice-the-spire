import type { ReactNode } from "react";
import SpOutlinedText from "../SpOutlinedText";
import "./SpItemLabel.css";

export interface SpItemLabelProps {
  className?: string;
  children: ReactNode;
}

const SpItemLabel = ({ className, children }: SpItemLabelProps) => {
  className ||= "";
  return (
    <div className={`item-label ${className}`} aria-hidden="true">
      <SpOutlinedText>{children}</SpOutlinedText>
    </div>
  );
};

export default SpItemLabel;
