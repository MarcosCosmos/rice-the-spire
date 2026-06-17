import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
const mount = (widget: ReactNode) => {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error("Couldn't find mount target #root");
  }
  createRoot(root).render(widget);
};
export default mount;
