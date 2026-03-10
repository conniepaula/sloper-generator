import { describe, expect, expectTypeOf, it } from "vitest";
import { assertNonEmpty, assertNonNull, type NonEmptyArray } from "./assert";

describe("assertNonEmpty", () => {
  it("does not throw for non-empty array", () => {
    const arr = [1, 2, 3];

    expect(() => assertNonEmpty(arr, "Array is empty")).not.toThrow();
  });

  it("throws for empty array with provided message", () => {
    const arr: number[] = [];
    const message = "Array must not be empty";

    expect(() => assertNonEmpty(arr, message)).toThrow(message);
  });

  it("stops throwing when first element is added", () => {
    const arr: number[] = [];

    expect(() => assertNonEmpty(arr, "First error")).toThrow("First error");

    arr.push(1);
    expect(() => assertNonEmpty(arr, "Second error")).not.toThrow();
  });

  it("type guard narrows array to NonEmptyArray", () => {
    const arr: string[] = ["a", "b"];

    // Before assertion, arr should be typed as Array<string>
    expectTypeOf(arr).toEqualTypeOf<Array<string>>();

    assertNonEmpty(arr, "Array cannot be empty");
    expectTypeOf(arr).toEqualTypeOf<NonEmptyArray<string>>();
    // After assertion, arr should be typed as NonEmptyArray<string>
  });

  it("after using type guard, arr[0] should be defined", () => {
    const arr: string[] = ["a", "b"];
    assertNonEmpty(arr, "Empty array");

    const first = arr[0];
    expect(first).toBeDefined();
    expectTypeOf(first).toEqualTypeOf<string>();
  });

  it("works with various and combined data types", () => {
    const objectArr = [{ x: 1 }, { x: 2 }];
    const boolArr = [true, "s"];

    expect(() => assertNonEmpty(objectArr, "Objects empty")).not.toThrow();
    expect(() => assertNonEmpty(boolArr, "Booleans empty")).not.toThrow();
  });
});

describe("assertNonNull", () => {
  it("does not throw for a defined and not null value", () => {
    const value = [1, 2, 3];

    expect(() => assertNonNull(value, "value is undefined")).not.toThrow();
  });

  it("throws for null value with provided message", () => {
    const value = null;
    const message = "value must not be null";

    expect(() => assertNonNull(value, message)).toThrow(message);
  });

  it("stops throwing when value becomes defined", () => {
    const value: { prop?: string } = {};
    expect(() => assertNonNull(value.prop, "First error")).toThrow(
      "First error",
    );

    value.prop = "assigning value";
    expect(() => assertNonNull(value.prop, "Second error")).not.toThrow();
  });

  it("type guard narrows value to NonNullable", () => {
    // must be tested using a fn since otherwise TS knows it's not null if it's defined
    const testNarrowing = (value: number[] | null) => {
      expectTypeOf<typeof value>().toEqualTypeOf<number[] | null>();
      assertNonNull(value, "message");
      expectTypeOf<typeof value>().toEqualTypeOf<number[]>();
    };

    testNarrowing([1, 2, 3]);
  });

  it("after using type guard, value.prop should be defined", () => {
    const value: { prop?: string } = { prop: "testing" };
    expectTypeOf(value.prop).toBeNullable();
    assertNonNull(value.prop, "value.props might be undefined");

    // After assertion
    expect(value.prop).toBeDefined();
    expectTypeOf(value.prop).toEqualTypeOf<string>();
  });
});
