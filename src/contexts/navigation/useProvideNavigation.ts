import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import AppNavigationManager from "./AppNavigationManager";
import { NavigationContext } from "./NavigationContext";

export interface ActionLog {
  uid?: number;
}
export interface RegisterGroupAction extends ActionLog {
  type: "RegisterGroup";
  id: string;
}

export interface UpdateGroupAction extends ActionLog {
  type: "UpdateGroup";
  id: string;
  element: HTMLElement;
}

export interface RegisterItemAction extends ActionLog {
  type: "RegisterItem";
  id: string;
}

export interface UpdateItemAction extends ActionLog {
  type: "UpdateItem";
  id: string;
  element: HTMLElement;
}

export interface DeregisterGroupAction extends ActionLog {
  type: "DeregisterGroup";
  id: string;
}

export interface DeregisterItemAction extends ActionLog {
  type: "DeregisterItem";
  id: string;
}

/**
 * Dummy action indicating a noticable change; it will cause the reducer to check for an update;
 * again it's probably not good usage but we'll try it for now.
 */
export interface FocusChanged extends ActionLog {
  type: "FocusChanged";
}

export type NavigationAction =
  | RegisterGroupAction
  | UpdateGroupAction
  | RegisterItemAction
  | UpdateItemAction
  | DeregisterItemAction
  | DeregisterGroupAction
  | FocusChanged;

// it  feels a little weird using a reducer like this for something so clearly out of state.
// it's probably not the best usage, but it's good to try and but it does have a couple of advantages:
// - encouraging more stateless thinking, e.g. that groups and items can find each other
// - facilitating synchronisation with react sequencing and being able to log that.
// update: in fact react is checking the purity of the reduce and finding that it isn't, raising errors.
// technically we can trivially make these functions repeatable but that won't make them pure.
// we could also make it pure but I'm not sure that it should be yet; there is also the issue of potential reordering to worry about.
// will deal with all that later and just make this 'safe' (with side effects) for now.
// for now this was useful in making sure it was a false flag
const createNavigationReducer = (navManager: AppNavigationManager) => {
  return (
    state: Partial<NavigationContext>,
    action: NavigationAction,
  ): Partial<NavigationContext> => {
    console.log(
      Date.now(),
      "running action",
      JSON.stringify({ ...action, element: undefined }),
    );
    switch (action.type) {
      case "RegisterGroup":
        navManager.registerGroup(action.id);
        break;
      case "UpdateGroup":
        navManager.updateGroup(action.id, action.element);
        break;
      case "RegisterItem":
        navManager.registerItem(action.id);
        break;
      case "UpdateItem":
        navManager.updateItem(action.id, action.element);
        break;
      case "DeregisterGroup":
        navManager.deregisterGroup(action.id);
        break;
      case "DeregisterItem":
        navManager.deregisterItem(action.id);
        break;
      case "FocusChanged":
        // just check if the active details changed.
        break;
    }
    if (navManager.activeItemId === state.activeItemId) {
      return state;
    } else {
      console.log(
        "change occured:",
        state.activeItemId,
        navManager.activeItemId,
      );
      return {
        activeItemId: navManager.activeItemId,
      };
    }
  };
};

let actionCounter = 0;

export const useProvideNavigation = () => {
  const _manager = useRef<AppNavigationManager>(undefined);
  const [navigationState, setNavigationState] = useState<
    Partial<NavigationContext>
  >({});
  const _state = useRef<Partial<NavigationContext>>(navigationState);
  const manager = (_manager.current ??= new AppNavigationManager());
  const reducer = useCallback(createNavigationReducer(manager), []);
  const dispatch = useCallback((action: NavigationAction) => {
    _state.current = reducer(_state.current, action);
    setNavigationState(_state.current);
  }, []);

  useEffect(() => {
    const listener = () => {
      dispatch({ type: "FocusChanged" });
    };
    manager.subscribe(listener);
    manager.start();
    return () => {
      manager.unsubscribe(listener);
      manager.stop();
    };
  }, []);
  return useMemo<NavigationContext>(
    () => ({
      ...navigationState,
      dispatchUpdate: (action) => {
        console.log(
          Date.now(),
          "requesting action",
          JSON.stringify({ ...action, element: undefined }),
        );
        dispatch(action);
      },
    }),
    [navigationState],
  );
};
