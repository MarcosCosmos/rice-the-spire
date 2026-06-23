import { createContext } from "react";
import type { NavigationAction } from "./useProvideNavigation";
/**
 * Note: it is generally intended for groups to override the context to quietly provide the groupId, rather than for items to be aware of it.
 */
export interface NavigationContext {
  readonly activeItemId?: string;
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  dispatchUpdate(this: void, action: NavigationAction): void;
}
export const NavigationContext = createContext<NavigationContext | undefined>(
  undefined,
);
