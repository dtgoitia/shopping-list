import { setBContainsSetA } from "./set";

describe("Set operations", () => {
  test("set A is contained inside set B", () => {
    const a = new Set([1, 2]);
    const b = new Set([1, 2, 3, 3]);
    expect(setBContainsSetA(a, b)).toBe(true);
  });

  test("set A is not contained inside set B", () => {
    const a = new Set([1, 2, 3, 3]);
    const b = new Set([1, 2]);
    expect(setBContainsSetA(a, b)).toBe(false);
  });
});
