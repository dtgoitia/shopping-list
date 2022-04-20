import { Item } from "./domain";

export const LOAD_ITEMS_FROM_CONFIG = false;

export const ITEMS: Item[] = [
  { id: 1, name: "Bananas", shop: "Lidl", toBuy: true },
  { id: 2, name: "Apples", shop: "Morrisons", toBuy: false },
  { id: 3, name: "Kiwis", shop: "Morrisons", toBuy: false },
];
