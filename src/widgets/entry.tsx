import { Default } from "./Default";
import { createRoot } from "react-dom/client";
const lookup = {
  default: Default,
};

const Widget = () => {
  const key = (new URLSearchParams(document.location.search)
    .get("widget")
    ?.toLowerCase() || "default") as keyof typeof lookup;
  const target = lookup[key];
  return target();
};

createRoot(document.getElementById("root")!).render(<Widget />);
