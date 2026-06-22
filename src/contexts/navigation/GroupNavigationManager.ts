import type AppNavigationManager from "./AppNavigationManager";

export class GroupNavigationManager {
  private parentManager: AppNavigationManager;
  private items: Map<string, HTMLElement>;
  private isRegistered: boolean;
  readonly groupId: string;
  constructor(parentManager: AppNavigationManager, groupId: string) {
    this.groupId = groupId;
    this.parentManager = parentManager;
    this.items = new Map();
    this.isRegistered = false;
  }

  get registered() {
    return this.isRegistered;
  }

  set registered(newValue: boolean) {
    this.isRegistered = newValue;
    if (newValue) {
      for (const [itemId, itemElement] of this.items.entries()) {
        this.parentManager.registerItem(itemElement, itemId, this.groupId);
      }
    } else {
      for (const itemId of this.items.keys()) {
        this.parentManager.deregisterItem(itemId);
      }
      this.parentManager.deregisterGroup(this.groupId);
    }
  }

  registerItem(element: HTMLElement, itemId: string) {
    this.items.set(itemId, element);
    if (this.registered) {
      this.parentManager.registerItem(element, itemId, this.groupId);
    }
  }

  deregisterItem(itemId: string) {
    if (this.isRegistered) {
      this.parentManager.deregisterItem(itemId);
    }
    this.items.delete(itemId);
  }
}
