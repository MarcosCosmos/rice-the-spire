import {
  useId,
  useContext,
  useCallback,
  useEffect,
  useSyncExternalStore,
  useRef,
  useState,
} from "react";
import { NavigationContext } from "./NavigationContext";

export const useNavigationItem = (disabled?: boolean) => {
  const id = useId();
  const navManager = useContext(NavigationContext);

  const subscribe = useCallback((callback: () => void) => {
    navManager.subscribe(callback);
    return () => {
      navManager.unsubscribe(callback);
    };
  }, []);

  const shouldHaveTabIndex = useSyncExternalStore(subscribe, () =>
    navManager.shouldHaveTabIndex(id),
  );

  // Notefor reasons I have yet to fathom,
  // storing the deregistration callback in a useState causes the stored value to be called as part of the render
  // None the less, we want the ref callback to directly register if appropriate and cache the element for us if not.
  // To achieve this we need a specific mix of states for react to listen to in these effects, and refs that the refcallback can universally access
  // the ref callback can call our setters but can't actually read the values without storing it in useRef
  const [element, setElement] = useState<HTMLElement | undefined>(undefined);
  const registered = useRef(false);
  const disabledRef = useRef<boolean>(disabled);
  disabledRef.current = disabled;

  useEffect(() => {
    if (!registered.current && element && !disabled) {
      navManager.dispatch({
        type: "AddItem",
        id,
        element,
      });
      registered.current = true;
    } else if (registered.current && (!element || disabled)) {
      navManager.dispatch({
        type: "DeleteItem",
        id,
      });
      registered.current = false;
    }
  }, [element, disabled, navManager]);

  const refCallback = useCallback(
    (element: HTMLElement | null) => {
      if (element) {
        setElement(element);
        if (!disabledRef.current) {
          navManager.dispatch({
            type: "AddItem",
            id,
            element,
          });
          registered.current = true;
        }
        return () => {
          navManager.dispatch({
            type: "DeleteItem",
            id,
          });
          setElement(undefined);
          registered.current = false;
        };
      }
    },
    [navManager],
  );

  return {
    id,
    ref: refCallback,
    tabIndex: shouldHaveTabIndex ? 0 : -1,
  };
};
