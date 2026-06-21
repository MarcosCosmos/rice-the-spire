import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import "./SpButton.css";
import useNavigation from "../../util/useNavigation";

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
  const navAttrs = useNavigation(disabled);
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
