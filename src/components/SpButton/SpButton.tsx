import type { ReactNode } from "react";
import { NavigationContext } from "../../contexts";
import type React from "react";
import "./SpButton.css";

export interface MenuButtonProps extends React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
}

const register = (element: HTMLElement | null) => {
  if (element) {
    return NavigationContext.register(element);
  }
};

export const SpButton = ({
  className,
  children,
  disabled,
  ...attrs
}: MenuButtonProps) => {
  className ??= "";
  return (
    <button
      className={`sp-button ${className}`}
      aria-disabled={disabled}
      tabIndex={0}
      ref={register}
      {...attrs}
    >
      {children}
    </button>
  );
};
