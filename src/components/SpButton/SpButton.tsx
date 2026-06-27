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
    <div
      className={`sp-button ${toggle ? "sp-button--toggle" : ""} ${toggle === "inverted" ? "sp-button--inverted" : ""}`}
    >
      {toggle && <div className="sp-button__pulse"></div>}
      <button
        className={className}
        disabled={disabled}
        {...navAttrs}
        {...attrs}
      >
        {children}
      </button>
    </div>
  );
};
