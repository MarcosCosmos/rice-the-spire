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
  highlightWhenActive?: boolean;
  highlightWhenInactive?: boolean;
}

export const SpButton = ({
  className,
  children,
  disabled,
  highlightWhenActive,
  highlightWhenInactive,
  ...attrs
}: SpButtonProps) => {
  className ??= "";
  highlightWhenActive ??= false;
  highlightWhenInactive ??= false;
  const navAttrs = useNavigationItem(disabled);
  return (
    <button
      className={`sp-button ${highlightWhenActive ? "sp-button--highlight-active" : ""} ${highlightWhenInactive ? "sp-button--highlight-inactive" : ""} ${className}`}
      disabled={disabled}
      {...navAttrs}
      {...attrs}
    >
      {children}
    </button>
  );
};
