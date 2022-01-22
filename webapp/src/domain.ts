import { setBContainsSetA } from "./set";

type Category = string;
export interface Item {
  id: number;
  name: string;
  otherNames: Set<string>;
  categories: Set<Category>;
  toBuy: boolean;
}

export interface Query {
  text: string;
  categories: Category[];
}

function matchesText(item: Item, text: string): boolean {
  const queryWords = new Set(text.split(" ")); // TODO: remove acentos

  const itemText = [item.name, ...Array.from(item.otherNames)]
    .map((str) => str.toLowerCase())
    // TODO: remove acentos
    .join(" ");

  for (const word of queryWords) {
    if (!itemText.includes(word)) return false;
  }

  return true;
}

function matchesCategories(item: Item, categories: Set<Category>): boolean {
  // Returns true if every category in `categories` is present in `item.categories`
  return setBContainsSetA(categories, item.categories);
}

export function search(items: Item[], query: Query): Item[] {
  let results = items;

  if (!!query.categories && query.categories.length > 0) {
    const categories = new Set(query.categories);
    results = results.filter((item) => matchesCategories(item, categories));
  }

  if (!!query.text) {
    results = results.filter((item) => matchesText(item, query.text));
  }

  return results;
}
