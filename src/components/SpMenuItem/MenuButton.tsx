import type { ReactNode } from "react";

export interface MenuButtonProps {
  className?: string;
  children: ReactNode;
  disabled?: boolean;
}

const MenuButton = ({
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
      {...attrs}
    >
      {children}
    </button>
  );
};
export default MenuButton;
