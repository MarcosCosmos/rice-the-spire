/* eslint-disable @typescript-eslint/prefer-literal-enum-member */
export interface ActionTracking {
  uid?: number;
}

export interface AddGroupAction {
  type: "AddGroup";
  id: string;
  element: HTMLElement;
}

export interface AddItemAction {
  type: "AddItem";
  id: string;
  element: HTMLElement;
}

export interface DeleteGroupAction {
  type: "DeleteGroup";
  id: string;
}

export interface DeleteItemAction {
  type: "DeleteItem";
  id: string;
}

/**
 * Dummy action indicating a noticable change; it will cause the reducer to check for an update;
 * again it's probably not good usage but we'll try it for now.
 */
export interface FocusChanged {
  type: "FocusChanged";
}

export type NavigationAction = ActionTracking &
  (AddGroupAction | AddItemAction | DeleteGroupAction | DeleteItemAction);

interface GroupNavigationNode {
  readonly type: "GroupNavigationNode";
  readonly id: string;
  readonly element: HTMLElement;
  /**
   * may only be nullish if there are no children
   */
  readonly activeChildId?: string;
  readonly children: readonly LeafNavigationNode[];
}

interface LeafNavigationNode {
  readonly type: "LeafNavigationNode";
  readonly element: HTMLElement;
  readonly id: string;
  readonly focusListener: (event: FocusEvent) => void;
}

type NavigationNode = LeafNavigationNode | GroupNavigationNode;

/**
 * An opaque state object for logging purposes only
 */
export interface NavigationState {
  type: "AppNavigationState";
}

interface AppNavigationStateInternal extends NavigationState {
  type: "AppNavigationState";
  readonly activeLeafId?: string;
  readonly roots: readonly NavigationNode[];
}

/**
 * Note: positions/cursors are indicative.
 * This means that they are never -1 but not be indexable.
 * Specifically, if we are querying a position with an element, we will return where it should be placed using values safe for splice/slice but not index.
 * If instead we query with an id, the result will be nullish in the case that it is not found and concrete in the case that it is found.
 */
interface LeafCursor {
  outerPosition: number;
  innerPosition?: number;
}

enum CursorMode {
  Any,
  PreferSameGroup = 1 << 1,
  PreserveActiveInGroup = 1 << 2,
  LeastDisruptive = PreferSameGroup | PreserveActiveInGroup,
}

export type ChangeListener = (state: Readonly<NavigationState>) => void;

// like the % operator but definitely wraps negatives
const absMod = (i: number, limit: number) => (i + limit) % limit;

let actionCounter = 0;

export class NavigationManager {
  private _state: AppNavigationStateInternal;
  private keyListener: (event: KeyboardEvent) => void;
  private changeListeners: ChangeListener[];
  constructor(state?: AppNavigationStateInternal) {
    this._state = state ?? {
      type: "AppNavigationState",
      activeLeafId: undefined,
      roots: [],
    };
    this.changeListeners = [];
    this.keyListener = this.onKeydown.bind(this);
  }

  /**
   * returns an opaque object, but does not deep copy, completely unsafe to mutate
   */
  get state(): NavigationState {
    return this._state;
  }

  get activeLeafId() {
    return this._state.activeLeafId;
  }

  shouldHaveTabIndex(leafId: string) {
    const cursor = this.findCursor(leafId);
    if (!cursor) {
      return false;
    }
    return (
      typeof cursor.innerPosition === "undefined" ||
      this.groupAt(cursor.outerPosition).activeChildId === leafId
    );
  }

  subscribe(listener: ChangeListener) {
    this.changeListeners.push(listener);
  }

  unsubscribe(listener: ChangeListener) {
    this.changeListeners.splice(this.changeListeners.indexOf(listener), 1);
  }

  dispatch(action: NavigationAction) {
    console.log(
      actionCounter++,
      JSON.stringify({ ...action, element: undefined }),
    );
    switch (action.type) {
      case "AddGroup":
        this.addGroup(action.id, action.element);
        break;
      case "AddItem":
        this.addItem(action.id, action.element);
        break;
      case "DeleteGroup":
        this.deleteGroup(action.id);
        break;
      case "DeleteItem":
        this.deleteItem(action.id);
        break;
    }
  }

  private notifyListeners() {
    console.log(this._state);
    for (const listener of this.changeListeners) {
      listener(this._state);
    }
  }

  /**
   *
   * @param element
   * @returns [0, roots.length] - note that a past the end will be at the value.length, not -1; this is safer for splicing
   */
  private suggestPosition(element: HTMLElement) {
    const index = this._state.roots.findIndex(
      (otherNode) =>
        element.compareDocumentPosition(otherNode.element) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    );
    if (index != -1) {
      const otherNode = this._state.roots[index];
      if (
        otherNode.type === "GroupNavigationNode" &&
        element.compareDocumentPosition(otherNode.element) &
          Node.DOCUMENT_POSITION_CONTAINED_BY
      ) {
        throw new Error(
          `Invalid state: group ${otherNode.id} should not be nested inside another prospective group, by apparently is`,
        );
      }
    }
    return index === -1 ? this._state.roots.length : index;
  }

  private findPosition(id: string) {
    const index = this._state.roots.findIndex((group) => group.id === id);
    return index === -1 ? undefined : index;
  }

  /**
   * Enscapsulates error checking
   */
  private groupAt(position: number) {
    if (position < 0 || position > this._state.roots.length) {
      throw new Error(
        `Invalid group position: ${position.toFixed(0)} is out of range [0, ${this._state.roots.length.toFixed(0)})`,
      );
    }
    const result = this._state.roots[position];
    if (result.type !== "GroupNavigationNode") {
      throw new Error(
        `Invalid group position: got an existing node for a group id that isn't a group node. You may incorrectly used AddItem with a Group somehow.`,
      );
    }
    return result;
  }

  addGroup(id: string, element: HTMLElement) {
    const destination = this.suggestPosition(element);
    const existingPosition = this.findPosition(id);

    // todo: we can optimise this by moving the splicing out the preceding nodes and only bother processing actual potential children but we'll deal with that later
    if (typeof existingPosition !== "undefined") {
      let isChange = false;
      if (destination !== existingPosition) {
        isChange = true;
      } else {
        const existingGroup = this.groupAt(existingPosition);
        isChange =
          !existingGroup.children.every(
            (otherLeaf) =>
              element.compareDocumentPosition(otherLeaf.element) &
              Node.DOCUMENT_POSITION_CONTAINED_BY,
          ) ||
          this._state.roots.some(
            (otherNode) =>
              element.compareDocumentPosition(otherNode.element) &
              Node.DOCUMENT_POSITION_CONTAINED_BY,
          );
      }

      if (isChange) {
        // first delete the group so we have a clean state to work with
        this.deleteGroupImpure(existingPosition);
      } else {
        return;
      }
    }

    const freeRoots = [];
    const children: LeafNavigationNode[] = [];
    for (const otherNode of this._state.roots.slice(destination)) {
      const outcome = element.compareDocumentPosition(otherNode.element);
      if (otherNode.type === "GroupNavigationNode") {
        if (
          outcome &
          (Node.DOCUMENT_POSITION_CONTAINS |
            Node.DOCUMENT_POSITION_CONTAINED_BY)
        ) {
          throw new Error(
            `Invalid state: groups ${id} and ${otherNode.id} had a contains or containedby relationship`,
          );
        }

        freeRoots.push(otherNode);
      } else if (outcome & Node.DOCUMENT_POSITION_CONTAINED_BY) {
        children.push(otherNode);
      } else {
        freeRoots.push(otherNode);
      }
      // technically we could add more assertions but we'll worry about that later
    }

    const group: GroupNavigationNode = {
      type: "GroupNavigationNode",
      id,
      element,
      children,
      activeChildId:
        children.length === 0
          ? undefined
          : (children.find((child) => child.id === this._state.activeLeafId)
              ?.id ?? children[0].id),
    };
    this._state = {
      ...this._state,
      roots: [...this._state.roots.slice(0, destination), group, ...freeRoots],
    };

    this.notifyListeners();
  }

  /**
   * Importantly, this does not delete any children, it only ungroups them. It also is a no-op if the group is absent.
   * This is (somewhat) neccessary due to relative instability in react refs and more importantly, the insistence on purity.
   * @param groupId
   * @returns
   */
  deleteGroup(groupId: string) {
    const position = this.findPosition(groupId);
    if (typeof position === "undefined") {
      return; // could be a duplicate attempt at deleting the group, which is permitted because react likes to be 'pure'
    }

    this.deleteGroupImpure(position);

    this.notifyListeners();
  }

  /**
   * Only to be run after doing safety checks that ensure the group exists; does not send notifications (since that could be redundant)
   * @param position
   */
  private deleteGroupImpure(position: number) {
    const group = this.groupAt(position);
    this._state = {
      ...this._state,
      roots: this._state.roots.toSpliced(
        position,
        1,
        ...group.children.map((leaf) => ({ ...leaf, parent: undefined })),
      ),
    };
  }

  private suggestCursor(element: HTMLElement): LeafCursor {
    let rootOutcome = 0;
    const rootIndex = this._state.roots.findIndex((otherNode) => {
      rootOutcome = element.compareDocumentPosition(otherNode.element);
      return (
        rootOutcome &
        (Node.DOCUMENT_POSITION_CONTAINS | Node.DOCUMENT_POSITION_FOLLOWING)
      );
    });
    if (rootIndex === -1) {
      return { outerPosition: this._state.roots.length };
    }

    if (rootOutcome & Node.DOCUMENT_POSITION_CONTAINS) {
      const otherNode = this.groupAt(rootIndex);
      const innerIndex = otherNode.children.findIndex(
        (otherChild) =>
          element.compareDocumentPosition(otherChild.element) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      );
      if (innerIndex === -1) {
        return {
          outerPosition: rootIndex,
          innerPosition: otherNode.children.length,
        };
      } else {
        return {
          outerPosition: rootIndex,
          innerPosition: innerIndex,
        };
      }
    } else {
      return {
        outerPosition: rootIndex,
      };
    }
  }

  private findCursor(id: string): LeafCursor | undefined {
    for (
      let rootPosition = 0;
      rootPosition < this._state.roots.length;
      rootPosition++
    ) {
      const otherNode = this._state.roots[rootPosition];
      if (otherNode.id === id) {
        return { outerPosition: rootPosition };
      } else if (otherNode.type === "GroupNavigationNode") {
        const innerPosition = otherNode.children.findIndex(
          (otherChild) => otherChild.id === id,
        );
        if (innerPosition !== -1) {
          return {
            outerPosition: rootPosition,
            innerPosition,
          };
        }
      }
    }
    return undefined;
  }

  private leafAt({
    outerPosition,
    innerPosition,
  }: LeafCursor): LeafNavigationNode {
    if (typeof innerPosition !== "undefined") {
      const group = this.groupAt(outerPosition);
      if (innerPosition < 0 || innerPosition > group.children.length) {
        throw new Error(
          `Invalid cursor: root position is out of range for length ${this._state.roots.length.toFixed(0)}: : ${JSON.stringify({ rootPosition: outerPosition, innerPosition })}`,
        );
      }
      return group.children[innerPosition];
    } else {
      if (outerPosition < 0 || outerPosition > this._state.roots.length) {
        throw new Error(
          `Invalid cursor: root position is out of range for length ${this._state.roots.length.toFixed(0)}: : ${JSON.stringify({ rootPosition: outerPosition, innerPosition })}`,
        );
      }
      const leaf = this._state.roots[outerPosition];
      if (leaf.type !== "LeafNavigationNode") {
        throw new Error(
          `Invalid cursor points to non-leaf ${leaf.id}: ${JSON.stringify({ rootPosition: outerPosition, innerPosition })}`,
        );
      }
      return leaf;
    }
  }

  addItem(id: string, element: HTMLElement) {
    const destination = this.suggestCursor(element);
    const existingCursor = this.findCursor(id);

    if (existingCursor) {
      let isChange = false;
      const existingLeaf = this.leafAt(existingCursor);
      isChange =
        destination.outerPosition != existingCursor.outerPosition ||
        destination.innerPosition !== existingCursor.innerPosition ||
        existingLeaf.id !== id ||
        existingLeaf.element !== element;
      if (isChange) {
        this.deleteItemImpure(existingCursor);
      } else {
        return;
      }
    }

    const leaf: LeafNavigationNode = {
      type: "LeafNavigationNode",
      id,
      element,
      focusListener: () => {
        this.onFocus(id);
      },
    };

    element.addEventListener("focus", leaf.focusListener);

    let outerReplacement: NavigationNode;
    if (typeof destination.innerPosition === "undefined") {
      outerReplacement = leaf;
    } else {
      const parent = this.groupAt(destination.outerPosition);
      outerReplacement = {
        ...parent,
        children: parent.children.toSpliced(destination.innerPosition, 0, leaf),
        activeChildId: parent.activeChildId ?? id,
      };
    }

    const activeLeafChanged = !this._state.activeLeafId;

    this._state = {
      ...this._state,
      roots: this._state.roots.toSpliced(
        destination.outerPosition,
        outerReplacement.type === "GroupNavigationNode" ? 1 : 0,
        outerReplacement,
      ),
      activeLeafId: this._state.activeLeafId ?? id,
    };

    this.notifyListeners();

    // do the focus change after notifying listeners to avoid potentially receiving some other instruction before we can notify.
    if (activeLeafChanged) {
      element.focus();
    }
  }

  /**
   * Note: this permits attempts to delete non-existant items, mostly because react requires that.
   */
  deleteItem(id: string) {
    const wasActive = this._state.activeLeafId === id;
    const cursor = this.findCursor(id);
    if (cursor) {
      this.deleteItemImpure(cursor);
    }

    this.notifyListeners();

    if (wasActive && this._state.activeLeafId) {
      const activeCursor = this.findCursor(this._state.activeLeafId);
      if (!activeCursor) {
        throw new Error(
          "Invalid state: could not find the current active leaf by id",
        );
      }
      this.leafAt(activeCursor).element.focus();
    }
  }

  /**
   * Only to be run after safety checks ensuring the item exists, does not check any of it's params more than neccessary for eslint.
   * Does NOT notify listeners or update focus
   * @param cursor
   * @param leaf
   */
  private deleteItemImpure(cursor: LeafCursor) {
    const leaf = this.leafAt(cursor);
    let activeLeafId = this._state.activeLeafId;
    let replacementGroup: GroupNavigationNode | undefined = undefined;
    if (typeof cursor.innerPosition !== "undefined") {
      const parent = this.groupAt(cursor.outerPosition);
      if (!parent.children.some((child) => child.id === leaf.id)) {
        throw new Error(
          "Invalid cursor: the suggested parent is not actually the parent",
        );
      }

      let activeChildId = parent.activeChildId;
      if (leaf.id === parent.activeChildId) {
        if (parent.children.length === 1) {
          activeChildId = undefined;
        } else if (cursor.innerPosition === parent.children.length - 1) {
          activeChildId = parent.children[cursor.innerPosition - 1].id;
        } else {
          activeChildId = parent.children[cursor.innerPosition + 1].id;
        }
        if (leaf.id === activeLeafId) {
          activeLeafId = activeChildId;
        }
      }
      replacementGroup = {
        ...parent,
        activeChildId,
        children: parent.children.toSpliced(cursor.innerPosition, 1),
      };
    }

    if (activeLeafId === leaf.id) {
      const nextCursor = this.findNextCursor(
        cursor,
        CursorMode.LeastDisruptive,
      );
      if (nextCursor) {
        activeLeafId = this.leafAt(nextCursor).id;
        if (activeLeafId === leaf.id) {
          throw new Error(
            "Invalid state: the next cursor cannot be the same as the current cursor",
          );
        }
      } else {
        activeLeafId = undefined;
      }
    }
    leaf.element.removeEventListener("focus", leaf.focusListener);
    this._state = {
      ...this._state,
      roots: replacementGroup
        ? this._state.roots.toSpliced(cursor.outerPosition, 1, replacementGroup)
        : this._state.roots.toSpliced(cursor.outerPosition, 1),
      activeLeafId,
    };
  }

  private findPreviousCursor(
    cursor: LeafCursor,
    mode: CursorMode,
  ): LeafCursor | undefined {
    if (typeof cursor.innerPosition !== "undefined") {
      const initialRoot = this.groupAt(cursor.outerPosition);
      if (
        (mode & CursorMode.PreferSameGroup ||
          !(mode & CursorMode.PreserveActiveInGroup)) &&
        cursor.innerPosition > 0
      ) {
        return {
          ...cursor,
          innerPosition: cursor.innerPosition - 1,
        };
      } else if (
        mode & CursorMode.PreferSameGroup &&
        initialRoot.children.length > 1
      ) {
        return {
          ...cursor,
          innerPosition: cursor.innerPosition + 1,
        };
      }
    }
    const len = this._state.roots.length;
    for (
      let outerPosition = absMod(cursor.outerPosition - 1, len);
      outerPosition != cursor.outerPosition;
      outerPosition = absMod(outerPosition - 1, len)
    ) {
      const otherNode = this._state.roots[outerPosition];
      if (otherNode.type === "LeafNavigationNode") {
        return { outerPosition: outerPosition };
      } else if (otherNode.children.length > 0) {
        return {
          outerPosition: outerPosition,
          innerPosition:
            mode & CursorMode.PreserveActiveInGroup
              ? otherNode.children.findIndex(
                  (child) => child.id === otherNode.activeChildId,
                )
              : otherNode.children.length - 1,
        };
      }
    }
    return undefined;
  }

  private findNextCursor(
    cursor: LeafCursor,
    mode: CursorMode,
  ): LeafCursor | undefined {
    if (typeof cursor.innerPosition !== "undefined") {
      const initialRoot = this.groupAt(cursor.outerPosition);
      if (
        (mode & CursorMode.PreferSameGroup ||
          !(mode & CursorMode.PreserveActiveInGroup)) &&
        cursor.innerPosition < initialRoot.children.length - 1
      ) {
        return {
          ...cursor,
          innerPosition: cursor.innerPosition + 1,
        };
      } else if (
        mode & CursorMode.PreferSameGroup &&
        initialRoot.children.length > 1
      ) {
        return {
          ...cursor,
          innerPosition: cursor.innerPosition - 1,
        };
      }
    }
    const len = this._state.roots.length;
    for (
      let outerPosition = (cursor.outerPosition + 1) % len;
      outerPosition != cursor.outerPosition;
      outerPosition = (outerPosition + 1) % len
    ) {
      const otherNode = this._state.roots[outerPosition];
      if (otherNode.type === "LeafNavigationNode") {
        return { outerPosition };
      } else if (otherNode.children.length > 0) {
        return {
          outerPosition,
          innerPosition:
            mode & CursorMode.PreserveActiveInGroup
              ? otherNode.children.findIndex(
                  (child) => child.id === otherNode.activeChildId,
                )
              : 0,
        };
      }
    }
    return undefined;
  }

  private findFirstCursor(): LeafCursor | undefined {
    if (this._state.roots.length === 0) {
      return undefined;
    }

    const first = this._state.roots[0];
    if (first.type === "GroupNavigationNode" && first.children.length > 0) {
      return { outerPosition: 0, innerPosition: 0 };
    }

    return this.findNextCursor({ outerPosition: 0 }, CursorMode.Any);
  }

  private findLastCursor(): LeafCursor | undefined {
    if (this._state.roots.length === 0) {
      return undefined;
    }

    const outerPosition = this._state.roots.length - 1;

    const last = this._state.roots[outerPosition];
    if (last.type === "GroupNavigationNode" && last.children.length > 0) {
      return { outerPosition, innerPosition: last.children.length - 1 };
    }

    return this.findPreviousCursor({ outerPosition }, CursorMode.Any);
  }

  /**
   * This is a notifying action
   * @param cursor
   */
  private moveLoudlyTo(cursor: LeafCursor) {
    const target = this.leafAt(cursor);
    if (this._state.activeLeafId === target.id) {
      return;
    }

    if (cursor.innerPosition) {
      const parent = this.groupAt(cursor.outerPosition);
      this._state = {
        ...this._state,
        activeLeafId: target.id,
        roots: this._state.roots.toSpliced(cursor.outerPosition, 1, {
          ...parent,
          activeChildId: target.id,
        }),
      };
    } else {
      this._state = {
        ...this._state,
        activeLeafId: target.id,
      };
    }

    this.notifyListeners();

    target.element.focus();
  }

  private onKeydown(event: KeyboardEvent) {
    if (this._state.roots.length === 0) {
      return; // no
    }

    if (!this._state.activeLeafId) {
      throw new Error(
        "Invalid state: there is no active leaf id even though there is at least one item",
      );
    }
    const activeCursor = this.findCursor(this._state.activeLeafId);

    if (!activeCursor) {
      throw new Error(
        "Invalid state: could not find the current active leaf by id",
      );
    }

    let newCursor: LeafCursor | undefined;
    let preventDefault = true;

    switch (event.key) {
      case "Tab":
        newCursor = event.shiftKey
          ? this.findPreviousCursor(
              activeCursor,
              CursorMode.PreserveActiveInGroup,
            )
          : this.findNextCursor(activeCursor, CursorMode.PreserveActiveInGroup);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        newCursor = this.findPreviousCursor(activeCursor, CursorMode.Any);
        break;
      case "ArrowDown":
      case "ArrowRight":
        newCursor = this.findNextCursor(activeCursor, CursorMode.Any);
        break;
      case "Home":
        newCursor = this.findFirstCursor();
        break;
      case "End":
        newCursor = this.findLastCursor();
        break;
      // enter is covered by it being a button
      //   case "Enter":
      case "Space": {
        const activeLeaf = this.leafAt(activeCursor);
        activeLeaf.element.dispatchEvent(
          new MouseEvent("click", {
            button: 0,
          }),
        );
        break;
      }
      default:
        preventDefault = false;
    }

    if (newCursor) {
      this.moveLoudlyTo(newCursor);
    }

    if (preventDefault) {
      event.preventDefault();
    }
  }

  private onFocus(id: string) {
    if (this._state.activeLeafId !== id) {
      this._state = {
        ...this._state,
        activeLeafId: id,
      };
      this.notifyListeners();
    }
  }

  start() {
    document.addEventListener("keydown", this.keyListener);
  }
  stop() {
    document.removeEventListener("keydown", this.keyListener);
  }
}

export default NavigationManager;
