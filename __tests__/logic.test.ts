import { Logic } from "../src/lib/logic";
import { expect, describe, it } from "vitest";

describe("Logic", () => {
  it("and", () => {
    expect(Logic.and([1, 1])).toBe(1);
    expect(Logic.and([1, 0])).toBe(0);
  });

  it("not", () => {
    expect(Logic.not([1])).toBe(0);
    expect(Logic.not([0])).toBe(1);
  });

  it("nand", () => {
    expect(Logic.nand([1, 1])).toBe(0);
    expect(Logic.nand([1, 0])).toBe(1);
  });

  it("xor", () => {
    expect(Logic.xor([1, 1])).toBe(0);
    expect(Logic.xor([1, 0])).toBe(1);
  });

  it("nor", () => {
    expect(Logic.nor([1, 1])).toBe(0);
    expect(Logic.nor([1, 0])).toBe(0);
  });

  it("or", () => {
    expect(Logic.or([1, 1])).toBe(1);
    expect(Logic.or([1, 0])).toBe(1);
  });

  it("xnor", () => {
    expect(Logic.xnor([1, 1])).toBe(1);
    expect(Logic.xnor([1, 0])).toBe(0);
  });
});
