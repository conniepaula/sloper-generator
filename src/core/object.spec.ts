import { describe, expect, test, expectTypeOf } from "vitest";
import { typedEntries } from "./object";


  test("typedEntries: returns entries like Object.entries", () => {
    const obj = {
      a: { x: 1 },
      b: { y: 2 },
    };

    const result = typedEntries(obj);

    expect(result).toEqual([
      ["a", { x: 1 }],
      ["b", { y: 2 }],
    ]);
  });

  test("typedEntries: returns empty array for empty object", () => {
    const obj = {};
    const result = typedEntries(obj);
    expect(result).toEqual([]);
  });


  test("typedEntries: keys are narrowed to keyof T (not string)", () => {
    const obj = {
      foo: { x: 1 },
      bar: { y: 2 },
    };

    const entries = typedEntries(obj);

    type Key = typeof entries[number][0];

    expectTypeOf<Key>().toEqualTypeOf<"foo" | "bar">();
  });

  test("typedEntries: values are narrowed to union of value types", () => {
    const obj = {
      foo: { x: 1 },
      bar: { y: 2 },
    };

    const entries = typedEntries(obj);

    type Value = typeof entries[number][1];

    expectTypeOf<Value>().toEqualTypeOf<
      { x: number } | { y: number }
    >();
  });

  test("typedEntries: preserves correct key/value pairing", () => {
    const obj = {
      foo: { x: 1 },
      bar: { y: 2 },
    };

    const entries = typedEntries(obj);

    entries.forEach(([key, value]) => {
      if (key === "foo") {
        // ✅ Now correctly narrowed
        expectTypeOf(value).toEqualTypeOf<{ x: number }>();
      }

      if (key === "bar") {
        expectTypeOf(value).toEqualTypeOf<{ y: number }>();
      }
    });
  });

  test("typedEntries: accepts primitive values (unknown constraint)", () => {
    const result = typedEntries({
      a: 1,
      b: "hello",
      c: true,
    });

    type Value = typeof result[number][1];

    expectTypeOf<Value>().toEqualTypeOf<
      number | string | boolean
    >();
  });