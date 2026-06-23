interface GroupData {
  element?: HTMLElement;
  id: string;
  // an index relative only to the group's available children
  position: number;
  size: number;
  first?: ItemData;
}
interface ItemData {
  elementRef?: HTMLElement;
  id: string;
  group?: GroupData;
  focusListener: (event: Event) => void;
}

export type ChangeListener = (
  activeItemId?: string,
  activeGroupId?: string,
) => void;

// todo: it might be worth wrapping this (and groupmanager) in state/reducer pattern for scheduling purposes?
// for now useSyncExternalStore seems appropriate at the app level though
// related todo: consider if we still need to manage tab indices at a group leve with role=application (or try for the practice anyway)

export class AppNavigationManager {
  private items: ItemData[];
  private groups: GroupData[];
  private _activeItemId?: string;
  private _activeGroupId?: string;
  private position: number;
  private keyListener: (event: KeyboardEvent) => void;
  private changeListeners: ChangeListener[];
  constructor() {
    this.items = [];
    this.groups = [];
    this.position = 0;
    this.changeListeners = [];
    this._activeItemId = undefined;
    this.keyListener = (event: KeyboardEvent) => {
      this.onKeydown(event);
    };
  }

  get activeItemId() {
    return this._activeItemId;
  }

  get activeGroupId() {
    return this._activeGroupId;
  }

  subscribe(listener: ChangeListener) {
    this.changeListeners.push(listener);
  }

  unsubscribe(listener: ChangeListener) {
    this.changeListeners.splice(this.changeListeners.indexOf(listener), 1);
  }

  registerGroup(groupId: string) {
    if (this.groups.some((group) => group.id === groupId)) {
      console.warn("duplicate registration attempted for group", groupId);
      return;
    }
    this.groups.push({
      id: groupId,
      position: 0,
      size: 0,
    });
  }

  updateGroup(groupId: string, newElement: HTMLElement) {
    const oldIndex = this.groups.findIndex((group) => group.id === groupId);
    const i = this.groups.findIndex(
      (existingGroup) =>
        !existingGroup.element ||
        newElement.compareDocumentPosition(existingGroup.element) &
          Node.DOCUMENT_POSITION_PRECEDING,
    );

    const group =
      oldIndex === -1
        ? {
            element: newElement,
            id: groupId,
            position: 0,
            size: 0,
          }
        : this.groups[oldIndex];

    if (i !== oldIndex) {
      if (oldIndex !== -1) {
        this.groups.splice(oldIndex, 1);
      }
      this.groups.splice(i, 0, group);
    }
    this.findItemsForGroup(group);
  }

  findItemsForGroup(group: GroupData) {
    const groupElement = group.element;
    const ownedItems =
      groupElement &&
      this.items.filter(
        (eachItem) =>
          eachItem.element &&
          groupElement.compareDocumentPosition(eachItem.element) &
            Node.DOCUMENT_POSITION_CONTAINED_BY,
      );
    if (ownedItems && ownedItems.length > 0) {
      group.first = ownedItems[0];
      group.size = ownedItems.length;
      for (const eachOwnedItem of ownedItems) {
        eachOwnedItem.group = group;
      }
      if (ownedItems.some((item) => this.activeItemId === item.id)) {
        this.updateFocus();
      }
    }
  }

  deregisterGroup(groupId: string) {
    const index = this.groups.findIndex(({ id }) => id === groupId);
    if (index === -1) {
      // throw new Error(`attempting to deregister unregistered group ${groupId}`);
      console.warn("deregistration attempted for unknown group", groupId);
      return;
    }
    const group = this.groups[index];
    this.groups.splice(index, 1);
    if (group.first) {
      const startIndex = this.items.indexOf(group.first);
      const ownedItems = this.items.slice(startIndex, startIndex + group.size);
      for (const eachOwnedItem of ownedItems) {
        eachOwnedItem.group = undefined;
      }
      if (ownedItems.some((item) => this.activeItemId === item.id)) {
        this.updateFocus();
      }
    }
  }

  /**
   * Inserts the element into the list of registered items based on DOM order
   * Also updates focus if it's the first item
   * @param element
   * @param itemId
   * @returns a cleanup method that deregisters the element/item
   */
  registerItem(itemId: string) {
    if (this.items.some((item) => item.id === itemId)) {
      console.warn("duplicate registration attempted for item", itemId);
      return;
    }
    const item = {
      id: itemId,
      focusListener: () => {
        this.focusListener(item);
      },
    };
    this.items.push(item);
  }

  updateItem(itemId: string, newElement: HTMLElement) {
    const oldIndex = this.items.findIndex((item) => item.id === itemId);
    const i = this.items.findIndex(
      (existingItem) =>
        !existingItem.element ||
        newElement.compareDocumentPosition(existingItem.element) &
          Node.DOCUMENT_POSITION_PRECEDING,
    );

    const item =
      oldIndex === -1
        ? {
            element: newElement,
            id: itemId,
            focusListener: () => {
              this.focusListener(item);
            },
          }
        : this.items[oldIndex];

    let changed = false;
    if (i !== oldIndex) {
      if (oldIndex !== -1) {
        this.items.splice(oldIndex, 1);
      }
      this.items.splice(i, 0, item);
      changed = true;
    }
    if (newElement !== item.element) {
      item.element?.removeEventListener("focus", item.focusListener);
      newElement.addEventListener("focus", item.focusListener);
      item.element = newElement;
      changed = true;
    }

    // see if the item belongs in a group
    this.findGroupForItem(item);

    if (changed) {
      if (this.items.length === 1) {
        // in that case we are now focusing the very first item
        this.updateFocus();
      } else if (this.position >= i) {
        // in all other cases where the position wasn't to the left, the position of the active item has technically shifted but we don't need to trigger an update
        this.position += 1;
        this.updateFocus();
      }
    }
  }

  private findGroupForItem(item: ItemData) {
    const itemElement = item.element;
    const group =
      itemElement &&
      this.groups.find(
        (eachGroup) =>
          eachGroup.element &&
          itemElement.compareDocumentPosition(eachGroup.element) &
            Node.DOCUMENT_POSITION_CONTAINS,
      );
    if (group && group != item.group) {
      if (
        !group.first?.element ||
        group.first.element.compareDocumentPosition(itemElement) &
          Node.DOCUMENT_POSITION_PRECEDING
      ) {
        group.first = item;
      }
      group.size++;

      if (item.id === this.activeItemId) {
        this.updateFocus();
      }
    } else {
      item.group = undefined;
    }
  }

  /**
   * Removes the item from registration and corrects focus as neccessary
   * @param item
   */
  deregisterItem(itemId: string) {
    const globalIndexOfItem = this.items.findIndex(({ id }) => id === itemId);
    if (globalIndexOfItem === -1) {
      // throw new Error(`attempting to deregister unregistered item ${itemId}`);
      console.warn("deregistration attempted for unknown item", itemId);
      return;
    }
    const item = this.items[globalIndexOfItem];
    item.element?.removeEventListener("focus", item.focusListener);
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
        newPosition = this.items.length > 0 ? this.items.length - 1 : 0;
      }
    }
    if (wasActive || newPosition != this.position) {
      this.position = newPosition;
      this.updateFocus();
    } else if (globalIndexOfItem <= this.position) {
      // the active item was after the removed item, so the position needs to slice down too, but we don't need to trigger an update as such
      this.position -= 1;
      this.updateFocus();
    }
  }

  /**
   * Automatically checks and updates both element focus and aria-activedescendant as neccessary, avoiding redundant operations.
   * Does NOT call change listeners (to avoid recursion as an effect of something from react), instead it returns a bool as to whether or not the targets were updated.
   */
  private updateFocus(): boolean {
    if (this.position < 0) {
      throw new Error(
        `Invalid state: position ${this.position.toString()} cannot be leses than 0`,
      );
    }
    let nextActiveItemId = this._activeItemId;
    let nextActiveGroupId = this._activeGroupId;
    if (this.position < this.items.length) {
      const item = this.items[this.position];
      nextActiveItemId = item.id;
      nextActiveGroupId = item.group?.id;
      if (nextActiveItemId != this._activeItemId) {
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
          item.element?.focus();
        }
      }
    } else {
      nextActiveItemId = undefined;
      nextActiveGroupId = undefined;
    }
    if (
      nextActiveItemId !== this._activeItemId ||
      nextActiveGroupId !== this._activeGroupId
    ) {
      this._activeItemId = nextActiveItemId;
      this._activeGroupId = nextActiveGroupId;
      return true;
    } else {
      return false;
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
        const currentElement = currentItem.element;
        if (currentElement) {
          const nonEmptyNeighbourGroups = this.groups.filter(
            (x) => x != currentItem.group && x.element && x.size > 0,
          );
          // this could be optimised but we really don't need to
          // todo: wraparound
          // also these start indices seem broken probably due to ordering issues
          if (nonEmptyNeighbourGroups.length > 0) {
            let targetGroup;
            if (event.shiftKey) {
              targetGroup = nonEmptyNeighbourGroups.findLast(
                (eachGroup) =>
                  eachGroup.element &&
                  currentElement.compareDocumentPosition(eachGroup.element) &
                    Node.DOCUMENT_POSITION_PRECEDING,
              );
              targetGroup ??= nonEmptyNeighbourGroups.at(-1);
            } else {
              targetGroup = nonEmptyNeighbourGroups.find(
                (eachGroup) =>
                  eachGroup.element &&
                  currentElement.compareDocumentPosition(eachGroup.element) &
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
          }
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
      case "Space": {
        const currentElement = this.items[this.position].element;
        if (currentElement) {
          currentElement.dispatchEvent(
            new MouseEvent("click", {
              button: 0,
            }),
          );
        } else {
          preventDefault = false;
        }
        break;
      }
      default:
        preventDefault = false;
    }

    if (newPosition != this.position) {
      this.position = newPosition;
      if (this.updateFocus()) {
        this.changeListeners.forEach((listener) => {
          listener(this._activeItemId, this._activeGroupId);
        });
      }
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
