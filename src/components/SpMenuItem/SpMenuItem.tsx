import MenuButton from "./MenuButton";
import SpTooltip from "../SpTooltip";
import "./SpMenuItem.css";
import type { ReactNode } from "react";

export interface SpMenuItemProps extends Record<string, any> {
  className?: string;
  children: ReactNode;
  tooltip?: string;
}

const SpMenuItem = ({ children, tooltip, ...attrs }: SpMenuItemProps) => {
  const button = (tooltipId?: string) => (
    <MenuButton aria-describedby={tooltipId} {...attrs}>
      {children}
    </MenuButton>
  );
  return tooltip ? <SpTooltip anchor={button}>{tooltip}</SpTooltip> : button();
};

export default SpMenuItem;
