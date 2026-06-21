import type React from "react";
import { useEffect } from "react";

interface ItemData {
  element: HTMLElement;
  focusListener: (event: Event) => void;
}
/**
 * Manages keyboard navigation
 * Note: because the application only contains one menubar and is intended to be heavily user customised, some liberties are taken.
 * e.g. for now we allow tab to behave normally (with slight enhanced management of position memory), though we could also assign that to group skipping for convenience.
 * Other than that, generally any custom keys would need to be documented (and ideally standard keys too), but until (if) we add custom keys, they can stay as easter eggs since tab still works as expected.
 */
export class Navigation {
  items: ItemData[];
  private position: number;
  private keyListener: (event: KeyboardEvent) => void;
  constructor() {
    this.items = [];
    this.position = 0;
    this.keyListener = (event: KeyboardEvent) => {
      this.onKeydown(event);
    };
  }
  register(element: HTMLElement) {
    const item = {
      element,
      focusListener: () => {
        this.focusListener(item);
      },
    };
    let i = 0;
    while (
      i < this.items.length &&
      element.compareDocumentPosition(this.items[i].element) ===
        Node.DOCUMENT_POSITION_PRECEDING
    ) {
      i++;
    }
    this.items.splice(i, 0, item);
    element.addEventListener("focus", item.focusListener);
    return () => {
      this.deregister(item);
    };
  }
  deregister(item: ItemData) {
    item.element.removeEventListener("focus", item.focusListener);
    this.items.splice(this.items.indexOf(item), 1);
    if (this.position >= this.items.length) {
      this.position = this.items.length;
    }
  }
  setUpdateFocus(position: number) {
    if (position != this.position) {
      this.position = position;
      if (position < this.items.length) {
        this.items[position].element.focus();
      }
    }
  }
  onKeydown(event: KeyboardEvent) {
    // no-op
    if (this.items.length === 0) {
      return;
    }
    let preventDefault = true;
    let newPosition = this.position;
    let refinedKey = event.key;
    if (event.key == "Tab") {
      refinedKey = event.shiftKey ? "ArrowUp" : "ArrowDown";
    }
    switch (refinedKey) {
      case "ArrowDown":
      case "ArrowRight":
        newPosition = (this.position + 1) % this.items.length;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        newPosition =
          (this.position - 1 + this.items.length) % this.items.length;
        break;
      case "Home":
        newPosition = 0;
        break;
      case "End":
        newPosition =
          (this.items.length - 1 + this.items.length) % this.items.length;
        break;
      // enter is covered by it being a button
      //   case "Enter":
      case "Space":
        this.items[this.position].element.dispatchEvent(
          new MouseEvent("click", {
            button: 0,
          }),
        );
        break;
      default:
        preventDefault = false;
    }

    this.setUpdateFocus(newPosition);

    if (preventDefault) {
      event.preventDefault();
    }
  }
  focusListener(item: ItemData) {
    this.position = this.items.indexOf(item);
  }
  start() {
    document.addEventListener("keydown", this.keyListener);
  }
  stop() {
    document.removeEventListener("keydown", this.keyListener);
  }
}

// we only need one global instance per page
const theNavigation = new Navigation();
const refCallback: React.RefCallback<HTMLElement> = (
  element: HTMLElement | null,
) => {
  if (element) {
    return theNavigation.register(element);
  }
};

export const useProvideNavigation = () => {
  useEffect(() => {
    theNavigation.start();
    return () => {
      theNavigation.stop();
    };
  }, []);
};

export const useNavigation = (disabled?: boolean) =>
  disabled
    ? { }
    : {
        tabIndex: 0,
        ref: refCallback,
      };
export default useNavigation;
