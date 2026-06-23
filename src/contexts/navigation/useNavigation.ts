import {
  type RefCallback,
  useState,
  useEffect,
  useMemo,
  useId,
  useContext,
  useCallback,
  useRef,
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
    navManager.subscribe(setActiveItem);
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
  const _groupManager = useRef<GroupNavigationManager>(undefined);
  const groupManager = (_groupManager.current ??= new GroupNavigationManager(
    navManager,
    groupId,
  ));

  const refCallback = useCallback((element: HTMLElement | null) => {
    if (element) {
      groupManager.register(element);
      return () => {
        groupManager.deregister();
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
  const [element, setElement] = useState<HTMLElement | undefined>(undefined);

  // Notefor reasons I have yet to fathom,
  // storing the deregistration callback in a useState causes the stored value to be called as part of the render
  // None the less, we want the ref callback to directly register if appropriate and cache the element for us if not.
  // To achieve this we need a specific mix of states for react to listen to in these effects, and refs that the refcallback can universally access
  // the ref callback can call our setters but can't actually read the values without storing it in useRef
  const [registered, setRegistered] = useState(false);
  const deregistrationRef = useRef<(() => void) | undefined>(undefined);
  const disabledRef = useRef<boolean>(disabled);
  disabledRef.current = disabled;

  useEffect(() => {
    if (!registered && element && !disabled && navigation?.registerItem) {
      deregistrationRef.current = navigation.registerItem(element, id);
      setRegistered(true);
    } else if (registered && (!element || disabled)) {
      if (!deregistrationRef.current) {
        throw new Error(
          `Invalid state: deregistrationRef.current is undefined but the registered flag is true`,
        );
      }
      deregistrationRef.current();
      deregistrationRef.current = undefined;
      setRegistered(false);
    }
  }, [element, disabled, navigation?.registerItem]);

  const refCallback = useCallback((element: HTMLElement | null) => {
    if (element) {
      setElement(element);
      if (!deregistrationRef.current && navigation && !disabledRef.current) {
        deregistrationRef.current = navigation.registerItem(element, id);
        setRegistered(true);
      }

      return () => {
        setElement(undefined);
        if (deregistrationRef.current) {
          deregistrationRef.current = undefined;
          setRegistered(false);
        }
      };
    }
  }, []);

  return {
    id,
    ref: refCallback,
    tabIndex: disabled ? -1 : 0,
  };
};
