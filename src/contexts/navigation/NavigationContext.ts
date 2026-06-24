import { createContext } from "react";
import NavigationManager from "./AppNavigationManager";

export const NavigationContext = createContext<NavigationManager>(
  new NavigationManager(),
);
