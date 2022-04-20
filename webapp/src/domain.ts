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

// items <--- source of truth
// toBuy <-- derived from 'items'
// inventory <-- derived from 'items'
