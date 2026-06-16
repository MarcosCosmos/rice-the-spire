import type { ReactNode } from "react";
import { NavigationContext } from "../../contexts";

export interface MenuButtonProps extends Record<string, any> {
  className?: string;
  children: ReactNode;
  disabled?: boolean;
}

const register = (element: HTMLElement | null) => {
  if (element) {
    return NavigationContext.register(element);
  }
};

export const MenuButton = ({
  className,
  children,
  disabled,
  ...attrs
}: MenuButtonProps) => {
  className ||= "";
  return (
    <button
      className={`menu-item ${className}`}
      role="menuitem"
      aria-disabled={disabled}
      tabIndex={0}
      ref={register}
      {...attrs}
    >
      {children}
    </button>
  );
};
