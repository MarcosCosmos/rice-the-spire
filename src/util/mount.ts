import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
const mount = (widget: ReactNode) => {
  createRoot(document.getElementById("root")!).render(widget);
};
export default mount;
