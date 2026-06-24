import {
  type DetailedHTMLProps,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import "./SpMenuBar.css";
export interface SpMenuBarProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  className?: string;
  children: ReactNode;
}

/**
 * Not actually an aria menubar, which would not be advantageous since the app has the role app anyway
 * @param param
 * @returns
 */
export const SpMenuBar = ({
  className,
  children,
  ...attrs
}: SpMenuBarProps) => {
  className ??= "";
  return (
    <div className={`menubar ${className}`} {...attrs}>
      <div className="menubar__background" />
      <div className="menubar__content">{children}</div>
    </div>
  );
};
