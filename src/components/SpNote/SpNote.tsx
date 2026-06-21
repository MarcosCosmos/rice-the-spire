import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import { useNavigation } from "../../util";

export interface SpNoteProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  className?: string;
  children: ReactNode;
}
export const SpNote = ({ className, children, ...attrs }: SpNoteProps) => {
  className ??= "";
  const navAttrs = useNavigation();
  return (
    <div
      className={`sp-note ${className}`}
      tabIndex={0}
      {...navAttrs}
      {...attrs}
    >
      {children}
    </div>
  );
};
