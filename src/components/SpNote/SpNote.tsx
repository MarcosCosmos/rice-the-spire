import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import "./SpNote.css";
import { useNavigationItem } from "../../contexts";

export interface SpNoteProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  className?: string;
  children: ReactNode;
}
export const SpNote = ({ className, children, ...attrs }: SpNoteProps) => {
  className ??= "";
  const navAttrs = useNavigationItem();
  return (
    <div
      className={`sp-note ${className}`}
      role="note"
      {...navAttrs}
      {...attrs}
    >
      {children}
    </div>
  );
};
