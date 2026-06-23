import { useId, useContext, useCallback, useEffect } from "react";
import { NavigationContext } from "./NavigationContext";

export const useNavigationItem = (disabled?: boolean) => {
  const id = useId();
  const navigation = useContext(NavigationContext);

  // useEffect(() => {
  //   navigation?.dispatchUpdate({
  //     type: "RegisterItem",
  //     id,
  //   });

  //   return () => {
  //     navigation?.dispatchUpdate({
  //       type: "DeregisterItem",
  //       id,
  //     });
  //   };
  // }, []);

  const refCallback = useCallback(
    (element: HTMLElement | null) => {
      if (element) {
        navigation?.dispatchUpdate({
          type: "UpdateItem",
          id,
          element,
        });
      }
    },
    [id, navigation?.dispatchUpdate],
  );

  return {
    id,
    ref: refCallback,
    tabIndex: disabled ? -1 : 0,
  };
};
