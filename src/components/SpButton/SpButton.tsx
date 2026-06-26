import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import "./SpButton.css";
import { useNavigationItem } from "../../contexts";

export interface SpButtonProps extends DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  toggle?: boolean | "inverted";
}
export const SpButton = ({
  className,
  children,
  disabled,
  toggle,
  ...attrs
}: SpButtonProps) => {
  className ??= "";
  toggle ??= false;
  const navAttrs = useNavigationItem(disabled);
  return (
    <button
      className={`sp-button ${toggle ? "sp-button--toggle" : ""} ${toggle === "inverted" ? "sp-button--inverted" : ""} ${className}`}
      disabled={disabled}
      {...navAttrs}
      {...attrs}
    >
      {toggle && <div className="sp-button__pulse"></div>}
      {children}
    </button>
  );
};
