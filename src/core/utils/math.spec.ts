import { describe, expect, it } from "vitest";
import { clamp } from "./math";

describe("clamp", () => {
  it("correctly returns min if num < min", () => {
    const num = 5;
    const min = 6;
    const max = 7;

    const res = clamp(num, min, max);

    expect(res).toEqual(6);
  });

  it("correctly returns max if num > max", () => {
    const num = 8;
    const min = 6;
    const max = 7;

    const res = clamp(num, min, max);

    expect(res).toEqual(7);
  });

  it("correctly returns num if min < num < max", () => {
    const num = 8;
    const min = 5;
    const max = 10;

    const res = clamp(num, min, max);

    expect(res).toEqual(8);
  });
});
