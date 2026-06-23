import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import "./SpButton.css";
import { useNavigationItem } from "../../contexts";
import SpOutlinedText from "../SpOutlinedText";

export interface SpButtonProps extends DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
}

export const SpButton = ({
  className,
  children,
  disabled,
  ...attrs
}: SpButtonProps) => {
  className ??= "";
  const navAttrs = useNavigationItem(disabled);
  return (
    <button
      className={`sp-button ${className}`}
      disabled={disabled}
      {...navAttrs}
      {...attrs}
    >
      {children}
    </button>
  );
};
