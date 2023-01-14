import { ItemAutocompleter } from "./domain";
import { Item } from "./domain/model";

describe("Find items", () => {
  const defaultArgs = { shops: [], toBuy: true, otherNames: [] };

  const coder: Item = { id: "item_aaaaaaaaaa", name: "Coder", ...defaultArgs };
  const code: Item = { id: "item_bbbbbbbbbb", name: "Code", ...defaultArgs };
  const cocoa: Item = { id: "item_cccccccccc", name: "Cocoa", ...defaultArgs };
  const banana: Item = {
    id: "item_dddddddddd",
    name: "Banana",
    ...defaultArgs,
  };

  const items: Item[] = [coder, code, cocoa, banana];

  const completer = new ItemAutocompleter(items);

  test("by prefix", () => {
    const matched = completer.search(["co"]);
    expect(matched).toEqual(new Set([coder, code, cocoa]));
  });

  test("ignores case", () => {
    const uppercaseMatch = completer.search(["CO"]);
    expect(uppercaseMatch).toEqual(new Set([coder, code, cocoa]));

    const lowercaseMatch = completer.search(["co"]);
    expect(lowercaseMatch).toEqual(new Set([coder, code, cocoa]));
  });

  test("match the start of any word in the item", () => {
    const bigCocoa: Item = {
      id: "item_eeeeeeeeee",
      name: "Big cocoa",
      ...defaultArgs,
    };
    const items: Item[] = [coder, bigCocoa, banana];

    const completer = new ItemAutocompleter(items);

    const matched = completer.search(["co"]);
    expect(matched).toEqual(new Set([coder, bigCocoa]));
  });

  test("match multiple prefixes", () => {
    // let the UI split by space and pass each chunk to the autocompleter
    const prefixes: string[] = ["cod", "ban"];

    const matched = completer.search(prefixes);
    expect(matched).toEqual(new Set([coder, code, banana]));
  });
});
