import { type RefCallback, useId, useContext, useCallback } from "react";
import { NavigationContext } from "./NavigationContext";

export interface GroupNavigationProps {
  id: string;
  ref: RefCallback<HTMLElement>;
}

export const useNavigationGroup = (): GroupNavigationProps => {
  const id = useId();
  const navManager = useContext(NavigationContext);

  const refCallback = useCallback(
    (element: HTMLElement | null) => {
      if (element) {
        navManager.dispatch({
          type: "AddGroup",
          id,
          element,
        });
        return () => {
          navManager.dispatch({
            type: "DeleteGroup",
            id,
          });
        };
      }
    },
    [id, navManager],
  );
  return {
    id: id,
    ref: refCallback,
  };
};
