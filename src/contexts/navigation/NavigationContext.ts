import {
  createContext,
} from "react";
/**
 * Note: it is generally intended for groups to override the context to quietly provide the groupId, rather than for items to be aware of it.
 */
export interface NavigationContext {
  readonly activeItem?: string;
  registerItem(
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    this: void,
    element: HTMLElement,
    id: string,
  ): () => void;
}
export const NavigationContext = createContext<NavigationContext | undefined>(
  undefined,
);