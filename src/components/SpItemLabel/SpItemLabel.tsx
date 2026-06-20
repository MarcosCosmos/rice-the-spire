import type { CSSProperties, ReactNode } from "react";
import SpOutlinedText from "../SpOutlinedText";
import "./SpItemLabel.css";

export interface SpItemLabelProps {
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
}

export const SpItemLabel = ({
  className,
  children,
  style,
}: SpItemLabelProps) => {
  className ??= "";
  return (
    <div className={`item-label ${className}`} aria-hidden="true" style={style}>
      <SpOutlinedText>{children}</SpOutlinedText>
    </div>
  );
};
