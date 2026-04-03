import { assertType, describe, expect, expectTypeOf, it } from "vitest";

import {
  addCurve,
  addLine,
  getSeamLength,
  walkSeams,
  getLineArrayLength,
} from "./helpers";
import type { PatternCurve, PatternLine } from "./types";
import { curvePoints } from "../../../geometry/helpers";

describe("addLine", () => {
  it("correctly adds a line into the context with provided metadata", () => {
    const ctx = {
      lines: {} as Record<"front_bust" | "back_waist", PatternLine>,
    };

    const line = { from: { x: 0, y: 1 }, to: { x: 1, y: 0 } };
    addLine(ctx, "front", "bust", line, { name: "Bust", role: "guide" });

    const frontBust = ctx.lines.front_bust;

    expect(frontBust).toBeDefined();
    expectTypeOf(frontBust).toEqualTypeOf<PatternLine>();
    expect(frontBust).toMatchObject({
      geometry: { from: { x: 0, y: 1 }, to: { x: 1, y: 0 } },
      role: "guide",
      piece: "front",
      name: "Bust",
    });

    // type error when trying to create an id with the wrong piece type
    // @ts-expect-error "waist" is not assignable to "bust"
    assertType(addLine(ctx, "front", "waist", line, {}));
  });
});

describe("addCurve", () => {
  it("correctly adds a curve into the context with provided metadata", () => {
    const ctx = {
      curves: {} as Record<"front_neckline" | "back_armhole", PatternCurve>,
    };

    const curve = curvePoints({ x: 0, y: 1 }, { x: 1, y: 0 });

    addCurve(ctx, "back", "armhole", curve, { name: "Armhole" });
    const armhole = ctx.curves.back_armhole;

    expect(armhole).toBeDefined();
    expectTypeOf(armhole).toEqualTypeOf<PatternCurve>();
    // role not added, should be default: "guide"
    expect(armhole).toMatchObject({
      geometry: curve,
      role: "guide",
      piece: "back",
      name: "Armhole",
    });

    // type error when trying to create an id with the wrong piece type
    // @ts-expect-error "armhole" is not assignable to "neckline"
    assertType(addCurve(ctx, "front", "waist", curve, {}));
  });
});

describe("getLineArrayLength", () => {
  it("returns 0 for empty array", () => {
    expect(getLineArrayLength([])).toBe(0);
  });

  it("sums the lengths of provided lines", () => {
    const lines = [
      { from: { x: 0, y: 0 }, to: { x: 3, y: 4 } }, // length 5
      { from: { x: 0, y: 0 }, to: { x: 0, y: 2 } }, // length 2
    ];
    expect(getLineArrayLength(lines)).toBeCloseTo(7);
  });
});

describe("getSeamLength", () => {
  it("correctly calculates length for seam array", () => {
    const seamArray = [
      { from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
      { from: { x: -2, y: -2 }, to: { x: -1, y: -1 } },
    ];

    const result = getSeamLength(seamArray);
    expect(result).toBeCloseTo(2.828);
  });

  it("calculates length for a single-line seam", () => {
    const seam = { from: { x: 0, y: 0 }, to: { x: 1, y: 1 } };

    const result = getSeamLength(seam);
    expect(result).toBeCloseTo(1.414);
  });
});

describe("walkSeams", () => {
  it("does not throw when seams are equal length", () => {
    const seam1 = { from: { x: 1, y: 1 }, to: { x: 0, y: 0 } };
    const seam2 = { from: { x: 2, y: 2 }, to: { x: 1, y: 1 } };
    const opts = { sloper: "bodice" } as const;

    expectTypeOf(opts).toEqualTypeOf<{ readonly sloper: "bodice" }>();
    expect(() => walkSeams(seam1, seam2, opts)).not.toThrow();
  });

  it("throws when seams differ in length beyond tolerance", () => {
    const seam1 = { from: { x: 1, y: 1 }, to: { x: 0, y: 0 } };
    const seam2 = { from: { x: 0, y: 0 }, to: { x: 10, y: 10 } };
    const opts = { sloper: "bodice" } as const;

    expect(() => walkSeams(seam1, seam2, opts)).toThrow();
  });
});
