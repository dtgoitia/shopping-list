import { areEqual, setBContainsSetA } from "./set";

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

  test("set A equals set B", () => {
    const a = new Set([1, 3]);
    const b = new Set([3, 1]);
    expect(areEqual(a, b)).toBe(true);
  });

  test("set A does not equal set B - different size", () => {
    const a = new Set([1, 3]);
    const b = new Set([1, 2, 3]);
    expect(areEqual(a, b)).toBe(false);
  });

  test("set A does not equal set B - same size", () => {
    const a = new Set([1, 3]);
    const b = new Set([1, 2]);
    expect(areEqual(a, b)).toBe(false);
  });
});
