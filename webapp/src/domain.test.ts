import { search, Item, Query } from "./domain";

describe("Search", () => {
  const apple: Item = {
    id: 1,
    name: "Apples",
    otherNames: new Set(["manzana"]),
    categories: new Set(["Shop", "Supermarket", "Street market"]),
    toBuy: false,
  };
  const banana: Item = {
    id: 2,
    name: "Bananas",
    otherNames: new Set(["plátanos"]),
    categories: new Set(["Shop", "Street market"]),
    toBuy: false,
  };

  const items: Item[] = [apple, banana];

  test("no search returns every item", () => {
    const query: Query = { text: "", categories: [] };
    expect(search(items, query)).toEqual(items);
  });

  test("only by text", () => {
    const query: Query = { text: "man", categories: [] };
    expect(search(items, query)).toEqual([apple]);
  });

  test("only by one tag", () => {
    const query: Query = { text: "", categories: ["Shop"] };
    expect(search(items, query)).toEqual([apple, banana]);
  });

  test("only by two tags", () => {
    const query: Query = { text: "", categories: ["Shop", "Supermarket"] };
    expect(search(items, query)).toEqual([apple]);
  });

  test("text and tags", () => {
    const query: Query = { text: "ba", categories: ["Shop"] };
    expect(search(items, query)).toEqual([banana]);
  });

  test("text search is case agnostic", () => {
    const query: Query = { text: "app", categories: [] };
    expect(search(items, query)).toEqual([apple]);
  });

  test("text searches anywhere in the words - not only from the beginning", () => {
    const query: Query = { text: "ppl", categories: [] };
    expect(search(items, query)).toEqual([apple]);
  });
});
