import { expect, expectTypeOf, test } from "vitest";
import { assertNonEmpty, type NonEmptyArray } from "./assert";

test("assertNonEmpty: does not throw for non-empty array", () => {
  const arr = [1, 2, 3];

  expect(() => assertNonEmpty(arr, "Array is empty")).not.toThrow();
});

test("assertNonEmpty: throws for empty array with provided message", () => {
  const arr: number[] = [];
  const message = "Array must not be empty";

  expect(() => assertNonEmpty(arr, message)).toThrow(message);
});

test("assertNonEmpty: stops throwing when first element is added", () => {
  const arr: number[] = [];

  expect(() => assertNonEmpty(arr, "First error")).toThrow("First error");

  arr.push(1);
  expect(() => assertNonEmpty(arr, "Second error")).not.toThrow();
});

test("assertNonEmpty: type guard narrows array to NonEmptyArray", () => {
  const arr: string[] = ["a", "b"];

  // Before assertion, arr should be typed as Array<string>
  expectTypeOf(arr).toEqualTypeOf<Array<string>>();

  assertNonEmpty(arr, "Array cannot be empty");
  expectTypeOf(arr).toEqualTypeOf<NonEmptyArray<string>>();
  // After assertion, arr should be typed as NonEmptyArray<string>
});

test("assertNonEmpty: after using type guard, arr[0] should be defined", () => {
  const arr: string[] = ["a", "b"];
  assertNonEmpty(arr, "Empty array");

  const first = arr[0];
  expect(first).toBeDefined();
  expectTypeOf(first).toEqualTypeOf<string>();
});

test("assertNonEmpty: works with various and combined data types", () => {
  const objectArr = [{ x: 1 }, { x: 2 }];
  const boolArr = [true, "s"];

  expect(() => assertNonEmpty(objectArr, "Objects empty")).not.toThrow();
  expect(() => assertNonEmpty(boolArr, "Booleans empty")).not.toThrow();
});
