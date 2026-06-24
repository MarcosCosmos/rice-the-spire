import { type ProviderGroup, type ProviderGroupConfig } from "zebar";
import type { ReactNode } from "react";
import ZebarContext, { useProvideZebar } from "../../contexts/ZebarContext";
import "./SpApp.css";
import {
  TooltipFocusContext,
  useNavigationApp,
  useProvideTooltipFocus,
} from "../../contexts";

export interface SpAppProps {
  zebarProviders: ProviderGroup<ProviderGroupConfig>;
  children: ReactNode;
}

// TODO: ENHANCE KEYBOARD MANAGEMENT ENOUGH THAT WE CAN APPLY ROLE=APPLICATION TO THE ROOT, SHOULDN'T BE TO DIFFICULT ACTUALLY
export const SpApp = ({ zebarProviders, children }: SpAppProps) => {
  const zebar = useProvideZebar(zebarProviders);
  const tooltipFocus = useProvideTooltipFocus();
  const { activeDescendant } = useNavigationApp();
  return (
    <div
      className="app"
      role="application"
      aria-label="Zebar (Rice the Spire)"
      aria-activedescendant={activeDescendant ?? ""}
    >
      <ZebarContext value={zebar}>
        <TooltipFocusContext value={tooltipFocus}>
          {children}
        </TooltipFocusContext>
      </ZebarContext>
    </div>
  );
};
