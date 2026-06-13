import type { ReactNode } from "react";

const SpNum = ({ children }: { children: ReactNode }) => (
  <span className="tooltip-number">{children}</span>
);
export default SpNum;
