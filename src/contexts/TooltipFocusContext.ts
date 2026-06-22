import { createContext, useEffect, useState } from "react";

export interface TooltipFocusContext {
  targetId: string | null;
  update: (targetId: string | null) => void;
}

export const TooltipFocusContext = createContext<
  TooltipFocusContext | undefined
>(undefined);
export default TooltipFocusContext;

export const useProvideTooltipFocus = (): TooltipFocusContext | undefined => {
  const [tooltipFocus, setTooltipTargeting] = useState<
    TooltipFocusContext | undefined
  >();
  useEffect(() => {
    const updateTarget = (newTarget: string | null) => {
      if (newTarget !== tooltipFocus?.targetId) {
        setTooltipTargeting({
          targetId: newTarget,
          update: updateTarget,
        });
      }
    };
    setTooltipTargeting({
      targetId: tooltipFocus?.targetId ?? null,
      update: updateTarget,
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
  return tooltipFocus;
};
