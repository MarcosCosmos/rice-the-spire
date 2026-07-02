import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import "./SpOutlinedText.css";

export interface SpOutlinedTextProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
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
    <span className={`sp-outlined-text ${className}`} {...attrs}>
      <span className="sp-outlined-text__background" aria-hidden="true">
        {children}
      </span>
      <span className="sp-outlined-text__foreground">{children}</span>
    </span>
  );
};
