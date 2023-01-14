import { buildTrie, findWords, TrieNode, Word } from "./autocomplete";
import { Item } from "./domain/model";

export type FilterQuery = string;

export function getItemsToBuy(items: Item[]): Item[] {
  return items.filter((item) => item.toBuy);
}

export function filterInventory(items: Item[], query: FilterQuery): Item[] {
  if (query === "") return items;
  const completer = new ItemAutocompleter(items);

  const prefixes = query.split(" ").filter((prefix) => !!prefix);
  if (!prefixes) return items;

  const unsortedResults = completer.search(prefixes);

  return items.filter((item) => unsortedResults.has(item));
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
    const itemWords = [item.name, ...(item.otherNames || [])]
      .filter((name) => name)
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
