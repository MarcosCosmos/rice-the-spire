import { createContext, useEffect, useState } from "react";

export interface TooltipFocus {
  targetId: string | null;
  update: (targetId: string | null) => void;
}

export const useProvideTooltipFocus = () => {
  const [tooltipTargeting, setTooltipTargeting] = useState<
    TooltipFocus | undefined
  >();
  useEffect(() => {
    const updateTarget = (newTarget: string | null) => {
      if (newTarget !== tooltipTargeting?.targetId) {
        setTooltipTargeting({
          targetId: newTarget,
          update: updateTarget,
        });
      }
    };
    setTooltipTargeting({
      targetId: tooltipTargeting?.targetId ?? null,
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
  return tooltipTargeting;
};

export const TooltipFocusContext = createContext<TooltipFocus | undefined>(
  undefined,
);
export default TooltipFocusContext;
