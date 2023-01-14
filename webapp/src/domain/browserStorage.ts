import { Item } from "../domain/model";
import { Storage } from "../localStorage";
import { ItemManager } from "./ItemManager";
import { unreachable } from "./devex";

interface BrowserStorageArgs {
  itemManager: ItemManager;
  storage: Storage;
}

export class BrowserStorage {
  private itemManager: ItemManager;
  private storage: Storage;

  constructor({ itemManager, storage }: BrowserStorageArgs) {
    this.itemManager = itemManager;
    this.storage = storage;

    this.itemManager.changes$.subscribe((_) => {
      this.handleItemChanges();
    });
  }

  public getItems(): Item[] {
    if (this.storage.items.exists() === false) {
      return [];
    }

    const rawItems = this.storage.items.read();
    if (rawItems === undefined) {
      return [];
    }

    const items = rawItems.map(deserializeItem);
    return items;
  }

  private handleItemChanges(): void {
    this.storage.items.set(this.itemManager.getAll());
  }
}

function deserializeItem(raw: object): Item {
  if (raw === null || raw === undefined) {
    throw unreachable();
  }

  return raw as Item;
}
