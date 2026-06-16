import { createContext } from "react";

export interface TooltipTargeting {
    targetId?: string;
    updateTarget: (targetId?: string) => void;
}
const TooltipTargetingContext = createContext<TooltipTargeting | undefined>(undefined);
export default TooltipTargetingContext;