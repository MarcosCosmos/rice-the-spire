import {
  type RefCallback,
  useState,
  useEffect,
  useMemo,
  useId,
  useContext,
  useCallback,
} from "react";
import AppNavigationManager from "./AppNavigationManager";
import { GroupNavigationManager } from "./GroupNavigationManager";
import { NavigationContext } from "./NavigationContext";

export interface GroupNavigationProps {
  id: string;
  ref: RefCallback<HTMLElement>;
}

const navManager = new AppNavigationManager();

export const useProvideNavigation = () => {
  const [activeItem, setActiveItem] = useState<string | undefined>(undefined);
  const [registerItem] = useState(() => (element: HTMLElement, id: string) => {
    navManager.registerItem(element, id);
    return () => {
      navManager.deregisterItem(id);
    };
  });
  useEffect(() => {
    navManager.setActiveChangeCallback((id) => {
      setActiveItem(id);
    });
    navManager.start();
    return () => {
      navManager.stop();
    };
  }, []);
  return useMemo<NavigationContext>(
    () => ({
      activeItem,
      registerItem,
    }),
    [activeItem],
  );
};

export const useNavigationGroup: () => {
  navAttrs: GroupNavigationProps;
  navigation?: NavigationContext;
} = () => {
  const groupId = useId();
  const navigation = useContext(NavigationContext);
  const [groupManager] = useState(
    () => new GroupNavigationManager(navManager, groupId),
  );
  const refCallback = useCallback((element: HTMLElement | null) => {
    if (element) {
      navManager.registerGroup(element, groupId);
      groupManager.registered = true;
      return () => {
        groupManager.registered = false;
        navManager.deregisterGroup(groupId);
      };
    }
  }, []);
  const registerItemCallback = useCallback(
    (element: HTMLElement, itemId: string) => {
      groupManager.registerItem(element, itemId);
      return () => {
        groupManager.deregisterItem(itemId);
      };
    },
    [],
  );
  return useMemo(
    () => ({
      navAttrs: {
        id: groupId,
        ref: refCallback,
      },
      navigation: navigation && {
        ...navigation,
        registerItem: registerItemCallback,
      },
    }),
    [!!navigation, navigation?.activeItem],
  );
};

export const useNavigationItem = (disabled?: boolean) => {
  const id = useId();
  const navigation = useContext(NavigationContext);
  const callback = useCallback(
    (element: HTMLElement | null) => {
      if (element && !disabled) {
        return navigation?.registerItem(element, id);
      }
    },
    [id, navigation?.registerItem],
  );
  return {
    id,
    ref: callback,
    tabIndex: disabled ? -1 : 0,
  };
};
