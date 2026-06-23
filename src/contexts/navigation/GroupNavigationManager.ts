import type AppNavigationManager from "./AppNavigationManager";

export class GroupNavigationManager {
  private parentManager: AppNavigationManager;
  private groupElement?: HTMLElement;
  private items: Map<string, HTMLElement>;
  private registered: boolean;
  readonly groupId: string;
  constructor(parentManager: AppNavigationManager, groupId: string) {
    this.groupId = groupId;
    this.parentManager = parentManager;
    this.items = new Map();
    this.registered = false;
  }

  register(element: HTMLElement) {
    this.registered = true;
    this.groupElement = element;
    this.parentManager.registerGroup(element, this.groupId);
    for (const [itemId, itemElement] of this.items.entries()) {
      this.parentManager.registerItem(itemElement, itemId, this.groupId);
    }
  }

  deregister() {
    for (const itemId of this.items.keys()) {
      this.parentManager.deregisterItem(itemId);
    }
    this.parentManager.deregisterGroup(this.groupId);
    this.groupElement = undefined;
    this.registered = false;
  }

  registerItem(element: HTMLElement, itemId: string) {
    this.items.set(itemId, element);
    if (this.registered) {
      this.parentManager.registerItem(element, itemId, this.groupId);
    }
  }

  deregisterItem(itemId: string) {
    if (this.registered) {
      this.parentManager.deregisterItem(itemId);
    }
    this.items.delete(itemId);
  }
}
