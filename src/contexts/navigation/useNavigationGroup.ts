import {
  type RefCallback,
  useId,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { NavigationContext } from "./NavigationContext";

export interface GroupNavigationProps {
  id: string;
  ref: RefCallback<HTMLElement>;
}

export const useNavigationGroup = (): GroupNavigationProps => {
  const id = useId();
  const navigation = useContext(NavigationContext);

  //   useEffect(() => {
  //     navigation?.dispatchUpdate({
  //       type: "RegisterGroup",
  //       id,
  //     });
  //     return () => {
  //       navigation?.dispatchUpdate({
  //         type: "DeregisterGroup",
  //         id,
  //       });
  //     };
  //   }, []);
  const refCallback = useCallback(
    (element: HTMLElement | null) => {
      if (element) {
        navigation?.dispatchUpdate({
          type: "UpdateGroup",
          id,
          element,
        });
      }
    },
    [id, navigation?.dispatchUpdate],
  );
  return {
    id: id,
    ref: refCallback,
  };
};
