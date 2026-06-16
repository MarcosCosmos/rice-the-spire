import { useEffect, useState, type ReactNode } from "react";
import {
  createProviderGroup,
  type ProviderConfigMap,
  type ProviderGroup,
  type ProviderGroupConfig,
  type ProviderMap,
} from "zebar";
import ZebarContext from "../../contexts/ZebarContext";
import "./SpApp.css";
import { TooltipTargetingContext, type TooltipTargeting } from "../../contexts";

export interface SpAppProps {
  zebar: Partial<ProviderConfigMap>;
  children: ReactNode;
}
const SpApp = ({ zebar, children }: SpAppProps) => {
  const [output, setOutput] = useState<
    | Partial<{
        [TName in keyof ProviderConfigMap]: ProviderMap[ProviderConfigMap[TName]["type"]]["output"];
      }>
    | undefined
  >();

  useEffect(() => {
    const providers: ProviderGroup<ProviderGroupConfig> = createProviderGroup(
      zebar as unknown as ProviderGroupConfig,
    );
    providers.onOutput(() => setOutput(providers.outputMap));
  }, [zebar]);
  const [tooltipTargeting, setTooltipTargeting] = useState<
    TooltipTargeting | undefined
  >();
  useEffect(() => {
    const updateTarget = (newTarget: string | null) => {
      if (newTarget !== tooltipTargeting?.targetId) {
        setTooltipTargeting({
          targetId: newTarget,
          updateTarget,
        });
      }
    };
    setTooltipTargeting({
      targetId: tooltipTargeting?.targetId || null,
      updateTarget,
    });
    const escapeListener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        updateTarget("none");
      }
    };
    document.addEventListener("keydown", escapeListener);
    return () => {
      document.removeEventListener("keydown", escapeListener);
    };
  }, []);
  return (
    <ZebarContext value={output}>
      <TooltipTargetingContext value={tooltipTargeting}>
        {children}
      </TooltipTargetingContext>
    </ZebarContext>
  );
};

export default SpApp;
