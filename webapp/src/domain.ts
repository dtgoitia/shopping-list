import { ITEMS, LOAD_ITEMS_FROM_CONFIG } from "./config";
import storage from "./localStorage";

export type ItemId = number;
export type ShopName = string;
export interface Item {
  id: ItemId;
  name: string;
  shop: ShopName;
  toBuy: boolean;
}

export function addItemToBuy(items: Item[], id: ItemId): Item[] {
  return items.map((item: Item) => {
    if (item.id !== id) return item;
    return { ...item, toBuy: true };
  });
}

export function removeItemToBuy(items: Item[], id: ItemId): Item[] {
  return items.map((item: Item) => {
    if (item.id !== id) return item;
    return { ...item, toBuy: false };
  });
}

export function getItemsToBuy(items: Item[]): Item[] {
  return items.filter((item) => item.toBuy);
}

export function getItemsFromStorage(): Item[] {
  if (LOAD_ITEMS_FROM_CONFIG) {
    return ITEMS;
  }
  if (!storage.items.exists()) {
    return [];
  }

  const jsonString = storage.items.read();
  if (!jsonString) {
    return [];
  }

  return JSON.parse(jsonString);
}

// items <--- source of truth
// toBuy <-- derived from 'items'
// inventory <-- derived from 'items'
