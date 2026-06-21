import { type ReactNode } from "react";
import { type ProviderGroup, type ProviderGroupConfig } from "zebar";
import ZebarContext, { useZebarProviders } from "../../contexts/ZebarContext";
import "./SpApp.css";
import { TooltipFocusContext, useProvideTooltipFocus } from "../../contexts";
import { useProvideNavigation } from "../../util/useNavigation";

export interface SpAppProps {
  zebarProviders: ProviderGroup<ProviderGroupConfig>;
  children: ReactNode;
}

// TODO: ENHANCE KEYBOARD MANAGEMENT ENOUGH THAT WE CAN APPLY ROLE=APPLICATION TO THE ROOT, SHOULDN'T BE TO DIFFICULT ACTUALLY
export const SpApp = ({ zebarProviders, children }: SpAppProps) => {
  useProvideNavigation();
  const zebar = useZebarProviders(zebarProviders);
  const tooltipTargetting = useProvideTooltipFocus();
  return (
    <ZebarContext value={zebar}>
      <TooltipFocusContext value={tooltipTargetting}>
        {children}
      </TooltipFocusContext>
    </ZebarContext>
  );
};
