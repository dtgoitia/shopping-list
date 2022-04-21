import { buildTrie, findWords, TrieNode, Word } from "./autocomplete";
import { ITEMS, LOAD_ITEMS_FROM_CONFIG } from "./config";
import storage from "./localStorage";

export type ItemId = number;
export type ItemName = string;
export type ShopName = string;
export interface Item {
  id: ItemId;
  name: ItemName;
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

export function addItem(items: Item[], name: ItemName, shop: ShopName): Item[] {
  const newItem: Item = {
    id: items.length + 1, // 1-index based
    name: name,
    toBuy: false,
    shop: shop,
  };
  return [...items, newItem];
}

// items <--- source of truth
// toBuy <-- derived from 'items'
// inventory <-- derived from 'items'

interface WordsToItemMap {
  [w: Word]: Item[];
}
export class ItemAutocompleter {
  private trie: TrieNode;
  private wordToItems: WordsToItemMap;
  constructor(private readonly items: Item[]) {
    const [words, map] = this.itemsToWords(items);
    this.trie = buildTrie(words);
    this.wordToItems = map;
  }

  public search(prefixes: string[]): Set<Item> {
    const results: Set<Item> = new Set();

    prefixes
      .map((prefix) => this.searchSinglePrefix(prefix))
      .map((items) => [...items])
      .flat()
      .forEach((item) => results.add(item));

    return results;
  }

  private searchSinglePrefix(prefix: string): Set<Item> {
    const words = findWords(this.trie, prefix.toLowerCase());
    const items = this.getItemsFromWords(words);
    return items;
  }

  private itemsToWords(items: Item[]): [Word[], WordsToItemMap] {
    const words: Set<Word> = new Set();
    const map: WordsToItemMap = {};

    for (const item of items) {
      const itemWords = this.getWordsFromItem(item);

      for (const word of itemWords) {
        words.add(word);

        if (!map[word]) {
          map[word] = [item];
        } else {
          map[word].push(item);
        }
      }
    }

    const wordList: Word[] = [...words];

    return [wordList, map];
  }

  private getWordsFromItem(item: Item): Set<Word> {
    const itemWords = [item.name]
      .map((name) => name.toLowerCase())
      .map((name) => name.split(" "))
      .flat();

    const words = new Set(itemWords);
    return words;
  }

  private getItemsFromWords(words: Set<string>): Set<Item> {
    const items: Set<Item> = new Set();

    for (const word of words) {
      const wordItems = this.wordToItems[word];
      wordItems.forEach((word) => items.add(word));
    }

    return items;
  }
}
