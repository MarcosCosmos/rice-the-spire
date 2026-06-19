import { type ReactNode } from "react";
import { SpButton, type MenuButtonProps } from "../SpButton/SpButton";
import SpTooltip from "../SpTooltip";

export interface SpMenuItemProps extends MenuButtonProps {
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
    <SpButton
      className={className}
      aria-describedby={tooltipId}
      role="menuitem"
      {...attrs}
    >
      {children}
    </SpButton>
  );
  return tooltip ? <SpTooltip anchor={button}>{tooltip}</SpTooltip> : button();
};
