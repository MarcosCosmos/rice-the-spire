import { createContext } from "react";

export interface TooltipTargeting {
  targetId: string | null;
  updateTarget: (targetId: string | null) => void;
}
const TooltipTargetingContext = createContext<TooltipTargeting | undefined>(
  undefined,
);
export default TooltipTargetingContext;
