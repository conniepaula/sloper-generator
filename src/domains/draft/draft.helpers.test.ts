import { assertType, expect, expectTypeOf, test } from "vitest";

import { addCurve, addLine } from "./draft.helpers";
import type { DraftCurve, DraftLine } from "./draft.types";
import { curvePoints } from "../../geometry/geometry.helpers";

test("addLine: function correctly adds line into context", () => {
  const ctx = {
    lines: {} as Record<"front_bust" | "back_waist", DraftLine>,
  };

  const line = { from: { x: 0, y: 1 }, to: { x: 1, y: 0 } };
  addLine(ctx, "front", "bust", line, { name: "Bust", role: "guide" });

  const frontBust = ctx.lines.front_bust;

  expect(frontBust).toBeDefined();
  expectTypeOf(frontBust).toEqualTypeOf<DraftLine>();
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

test("addCurve: function correctly adds curve into context", () => {
  const ctx = {
    curves: {} as Record<"front_neckline" | "back_armhole", DraftCurve>,
  };

  const curve = curvePoints({ x: 0, y: 1 }, { x: 1, y: 0 });

  addCurve(ctx, "back", "armhole", curve, { name: "Armhole" });
  const armhole = ctx.curves.back_armhole;

  expect(armhole).toBeDefined();
  expectTypeOf(armhole).toEqualTypeOf<DraftCurve>();
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
