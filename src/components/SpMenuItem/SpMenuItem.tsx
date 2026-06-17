import { type ReactNode } from "react";
import { MenuButton } from "./MenuButton";
import SpTooltip from "../SpTooltip";
import "./SpMenuItem.css";

export interface SpMenuItemProps extends Record<string, any> {
  className?: string;
  children?: ReactNode;
  tooltip?: string | ReactNode;
}

export const SpMenuItem = ({
  className,
  children,
  tooltip,
  ...attrs
}: SpMenuItemProps) => {
  const button = (tooltipId?: string) => (
    <MenuButton className={className} aria-describedby={tooltipId} {...attrs}>
      {children}
    </MenuButton>
  );
  return tooltip ? <SpTooltip anchor={button}>{tooltip}</SpTooltip> : button();
};
