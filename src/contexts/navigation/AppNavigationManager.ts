interface GroupData {
  element: HTMLElement;
  id: string;
  // an index relative only to the group's available children
  position: number;
  size: number;
  first?: ItemData;
}
interface ItemData {
  element: HTMLElement;
  id: string;
  group?: GroupData;
  focusListener: (event: Event) => void;
}

export type ChangeListener = (activeItem?: string) => void;

// todo: it might be worth wrapping this (and groupmanager) in state/reducer pattern for scheduling purposes?
// for now useSyncExternalStore seems appropriate at the app level though
// related todo: consider if we still need to manage tab indices at a group leve with role=application (or try for the practice anyway)

export class AppNavigationManager {
  private items: ItemData[];
  private groups: GroupData[];
  private lastActiveItemId?: string;
  private position: number;
  private keyListener: (event: KeyboardEvent) => void;
  private changeListeners: ChangeListener[];
  constructor() {
    this.items = [];
    this.groups = [];
    this.position = 0;
    this.changeListeners = [];
    this.lastActiveItemId = undefined;
    this.keyListener = (event: KeyboardEvent) => {
      this.onKeydown(event);
    };
  }

  get activeItem() {
    return this.position >= this.items.length
      ? undefined
      : this.items[this.position].id;
  }

  get activeGroup() {
    return this.position >= this.items.length
      ? undefined
      : this.items[this.position].group?.id;
  }

  subscribe(listener: ChangeListener) {
    this.changeListeners.push(listener);
  }

  unsubscribe(listener: ChangeListener) {
    this.changeListeners.splice(this.changeListeners.indexOf(listener), 1);
  }

  registerGroup(element: HTMLElement, groupId: string) {
    if (this.groups.some(({ id }) => id === groupId)) {
      throw new Error(
        `${Date.now().toFixed(0)} new item ${groupId} is a duplicate.`,
      );
    }
    const group: GroupData = {
      element,
      id: groupId,
      position: 0,
      size: 0,
    };
    let i = 0;
    while (
      i < this.groups.length &&
      element.compareDocumentPosition(this.groups[i].element) &
        Node.DOCUMENT_POSITION_PRECEDING
    ) {
      i++;
    }
    this.groups.splice(i, 0, group);
  }

  deregisterGroup(groupId: string) {
    const index = this.groups.findIndex(({ id }) => id === groupId);
    if (index === -1) {
      throw new Error(`attempting to deregister unregistered group ${groupId}`);
    }
    this.groups.splice(index, 1);
  }

  /**
   * Inserts the element into the list of registered items based on DOM order
   * Also updates focus if it's the first item
   * @param element
   * @param itemId
   * @returns a cleanup method that deregisters the element/item
   */
  registerItem(element: HTMLElement, itemId: string, groupId?: string) {
    if (this.items.some(({ id }) => id === itemId)) {
      throw new Error(
        `${Date.now().toFixed(0)} new item ${itemId} is a duplicate.`,
      );
    }
    let group: GroupData | undefined = undefined;
    if (groupId) {
      group = this.groups.find((group) => group.id === groupId);
      if (!group) {
        throw new Error(
          `${Date.now().toFixed(0)} new item ${itemId} attempted to register with unknown groupId ${groupId}`,
        );
      }
    }
    const item: ItemData = {
      element,
      id: itemId,
      group,
      focusListener: () => {
        this.focusListener(item);
      },
    };

    let i = 0;
    while (
      i < this.items.length &&
      element.compareDocumentPosition(this.items[i].element) &
        Node.DOCUMENT_POSITION_PRECEDING
    ) {
      i++;
    }
    this.items.splice(i, 0, item);
    element.addEventListener("focus", item.focusListener);

    if (group) {
      if (
        !group.first ||
        group.first.element.compareDocumentPosition(element) &
          Node.DOCUMENT_POSITION_PRECEDING
      ) {
        group.first = item;
      }
      group.size++;
    }

    if (this.items.length === 1) {
      // in that case we are now focusing the very first item
      this.updateFocus();
    } else if (this.position >= i) {
      // in all other cases where the position wasn't to the left, the position of the active item has technically shifted but we don't need to trigger an update
      this.position += 1;
    }
  }

  /**
   * Removes the item from registration and corrects focus as neccessary
   * @param item
   */
  deregisterItem(itemId: string) {
    const globalIndexOfItem = this.items.findIndex(({ id }) => id === itemId);
    if (globalIndexOfItem === -1) {
      throw new Error(`attempting to deregister unregistered item ${itemId}`);
    }
    const item = this.items[globalIndexOfItem];
    item.element.removeEventListener("focus", item.focusListener);
    const wasActive = this.position === globalIndexOfItem;

    let newPosition = this.position;
    const group = item.group;
    if (group) {
      if (!group.first) {
        throw new Error(
          `invalid state: item ${item.id} belongs to group ${group.id} which has no first item.`,
        );
      }

      const groupStartIndex = this.items.indexOf(group.first);
      const indexOfItemInGroup = globalIndexOfItem - groupStartIndex;

      if (group.size === 1) {
        group.first = undefined;
      } else if (globalIndexOfItem === groupStartIndex) {
        group.first = this.items[groupStartIndex + 1];
        if (group.first.group !== group) {
          throw new Error("trying to assign item out of group");
        }
      }

      // we need to pull it back one if it was at the end of the group and there are neighbours in the group, otherwise it would leave the group
      if (wasActive && group.size > 1 && indexOfItemInGroup >= group.size - 1) {
        newPosition -= 1;
      }

      group.size--;
    }

    this.items.splice(globalIndexOfItem, 1);
    if (newPosition === this.position) {
      // not in a group or didn't need to be moved to stay in the group
      if (wasActive && this.position >= this.items.length) {
        newPosition = this.items.length - 1;
      }
    }
    if (wasActive || newPosition != this.position) {
      this.position = newPosition;
      this.updateFocus();
    } else if (globalIndexOfItem < this.position) {
      // the active item was after the removed item, so the position needs to slice down too, but we don't need to trigger an update as such
      this.position -= 1;
    }
  }

  /**
   * Automatically checks and updates both element focus and aria-activedescendant as neccessary, avoiding redundant operations.
   */
  private updateFocus() {
    let nextActiveItemId = this.lastActiveItemId;
    if (this.position < this.items.length) {
      const item = this.items[this.position];
      nextActiveItemId = item.id;
      if (nextActiveItemId != this.lastActiveItemId) {
        const group = item.group;
        if (group) {
          if (group.first === undefined) {
            throw new Error(
              `invalid state: item ${item.id} belongs to group ${group.id} which has no first item.`,
            );
          }
          const groupStartIndex = this.items.indexOf(group.first);
          group.position = this.position - groupStartIndex;
        }
        if (document.activeElement !== item.element) {
          item.element.focus();
        }
      }
    } else {
      nextActiveItemId = undefined;
    }
    if (nextActiveItemId !== this.lastActiveItemId) {
      this.lastActiveItemId = nextActiveItemId;
      this.changeListeners.forEach((listener) => {
        listener(nextActiveItemId);
      });
    }
  }

  private onKeydown(event: KeyboardEvent) {
    // no-op
    if (this.items.length === 0) {
      return;
    }
    let preventDefault = true;
    let newPosition = this.position;
    switch (event.key) {
      case "Tab": {
        const currentItem = this.items[this.position];
        const nonEmptyNeighbourGroups = this.groups.filter(
          (x) => x != currentItem.group && x.size > 0,
        );
        // this could be optimised but we really don't need to
        // todo: wraparound
        // also these start indices seem broken probably due to ordering issues
        if (nonEmptyNeighbourGroups.length > 0) {
          let targetGroup;
          if (event.shiftKey) {
            targetGroup = nonEmptyNeighbourGroups.findLast(
              (eachGroup) =>
                currentItem.element.compareDocumentPosition(eachGroup.element) &
                Node.DOCUMENT_POSITION_PRECEDING,
            );
            targetGroup ??= nonEmptyNeighbourGroups.at(-1);
          } else {
            targetGroup = nonEmptyNeighbourGroups.find(
              (eachGroup) =>
                currentItem.element.compareDocumentPosition(eachGroup.element) &
                Node.DOCUMENT_POSITION_FOLLOWING,
            );
            targetGroup ??= nonEmptyNeighbourGroups[0];
          }
          if (!targetGroup) {
            throw new Error(
              `Invalid state: could not find alternative group fr item ${currentItem.id} even though there are groups it does not belong to`,
            );
          }
          if (!targetGroup.first) {
            throw new Error(
              `Invalid state: a non-empty group lacks a first item`,
            );
          }
          const groupStartIndex = this.items.indexOf(targetGroup.first);
          newPosition = groupStartIndex + targetGroup.position;
        } else {
        }
        break;
      }
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

    if (newPosition != this.position) {
      this.position = newPosition;
      this.updateFocus();
    }

    if (preventDefault) {
      event.preventDefault();
    }
  }

  private focusListener(item: ItemData) {
    this.position = this.items.indexOf(item);
    this.updateFocus();
  }

  start() {
    document.addEventListener("keydown", this.keyListener);
  }
  stop() {
    document.removeEventListener("keydown", this.keyListener);
  }
}

export default AppNavigationManager;
