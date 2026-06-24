import { useCallback, useContext, useSyncExternalStore } from "react";
import { NavigationContext } from "./NavigationContext";

export const useNavigationApp = () => {
  const navManager = useContext(NavigationContext);

  const subscribe = useCallback((callback: () => void) => {
    navManager.subscribe(callback);
    navManager.start();
    return () => {
      navManager.unsubscribe(callback);
      navManager.stop();
    };
  }, []);

  const activeDescendant = useSyncExternalStore(
    subscribe,
    () => navManager.activeLeafId,
  );

  return {
    activeDescendant,
  };
};
