import { expect, test } from "vitest";
import { clamp } from "./math";

test("clamp: correctly returns min if num < min", () => {
  const num = 5;
  const min = 6;
  const max = 7;

  const res = clamp(num, min, max);

  expect(res).toEqual(6);
});
test("clamp: correctly returns max if num > max", () => {
  const num = 8;
  const min = 6;
  const max = 7;

  const res = clamp(num, min, max);

  expect(res).toEqual(7);
});
test("clamp: correctly returns num if min < num < max", () => {
  const num = 8;
  const min = 5;
  const max = 10;

  const res = clamp(num, min, max);

  expect(res).toEqual(8);
});
