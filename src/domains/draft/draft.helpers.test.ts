import { assertType, expect, expectTypeOf, test } from "vitest";

import {
  addCurve,
  addLine,
  extractLines,
  extractExportableLines,
  translateEntity,
  getSeamLength,
  walkSeams,
} from "./draft.helpers";
import type { DraftCurve, DraftLine, DraftEntity } from "./draft.types";
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

test("extractLines: extracts only line geometries from mixed entities", () => {
  const line1 = { from: { x: 0, y: 0 }, to: { x: 1, y: 1 } };
  const line2 = { from: { x: 2, y: 2 }, to: { x: 3, y: 3 } };
  const curve = curvePoints({ x: 0, y: 0 }, { x: 5, y: 5 });

  const entities: DraftEntity[] = [
    {
      id: "front_line1",
      kind: "line",
      geometry: line1,
      role: "guide",
      piece: "front",
      name: "Line 1",
      exportable: true,
    },
    {
      id: "front_curve1",
      kind: "curve",
      geometry: curve,
      role: "main_outer",
      piece: "front",
      name: "Curve 1",
      exportable: true,
    },
    {
      id: "front_line2",
      kind: "line",
      geometry: line2,
      role: "construction",
      piece: "front",
      name: "Line 2",
      exportable: false,
    },
  ];

  const lines = extractLines(entities);
  expect(lines).toHaveLength(2);
  expect(lines[0]).toEqual(line1);
  expect(lines[1]).toEqual(line2);
});

test("extractExportableLines: extracts only exportable line geometries", () => {
  const line1 = { from: { x: 0, y: 0 }, to: { x: 1, y: 1 } };
  const line2 = { from: { x: 2, y: 2 }, to: { x: 3, y: 3 } };
  const curve = curvePoints({ x: 0, y: 0 }, { x: 5, y: 5 });

  const entities: DraftEntity[] = [
    {
      id: "front_line1",
      kind: "line",
      geometry: line1,
      role: "guide",
      piece: "front",
      name: "Line 1",
      exportable: true,
    },
    {
      id: "front_curve1",
      kind: "curve",
      geometry: curve,
      role: "main_outer",
      piece: "front",
      name: "Curve 1",
      exportable: true,
    },
    {
      id: "front_line2",
      kind: "line",
      geometry: line2,
      role: "construction",
      piece: "front",
      name: "Line 2",
      exportable: false,
    },
  ];

  const exportableLines = extractExportableLines(entities);
  expect(exportableLines).toHaveLength(1);
  expect(exportableLines[0]).toEqual(line1);
});

test("translateEntity: translates line geometry while preserving metadata", () => {
  const line = { from: { x: 0, y: 0 }, to: { x: 1, y: 1 } };
  const entity: DraftEntity = {
    id: "front_line1",
    kind: "line",
    geometry: line,
    role: "guide",
    piece: "front",
    name: "Test Line",
    exportable: true,
  };

  const translated = translateEntity(entity, 5, 3) as Extract<
    DraftEntity,
    { kind: "line" }
  >;

  expect(translated.kind).toBe("line");
  expect(translated.geometry).toEqual({
    from: { x: 5, y: 3 },
    to: { x: 6, y: 4 },
  });
  expect(translated.role).toBe("guide");
  expect(translated.piece).toBe("front");
  expect(translated.name).toBe("Test Line");
});

test("translateEntity: translates curve geometry while preserving metadata", () => {
  const curve = curvePoints({ x: 0, y: 0 }, { x: 5, y: 5 });
  const entity: DraftEntity = {
    id: "front_curve1",
    kind: "curve",
    geometry: curve,
    role: "main_outer",
    piece: "front",
    name: "Test Curve",
    exportable: true,
  };

  const translated = translateEntity(entity, 2, -1) as Extract<
    DraftEntity,
    { kind: "curve" }
  >;

  expect(translated.kind).toBe("curve");
  expect(translated.geometry.start).toEqual({ x: 2, y: -1 });
  expect(translated.geometry.end).toEqual({ x: 7, y: 4 });
  expect(translated.role).toBe("main_outer");
  expect(translated.piece).toBe("front");
  expect(translated.name).toBe("Test Curve");
});

test("getSeamLength: correctly gets seam length for seams with multiple segments (line array)", () => {
  const seamArray = [
    { from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
    { from: { x: -2, y: -2 }, to: { x: -1, y: -1 } },
  ];

  const result = getSeamLength(seamArray);
  expect(result).toBeCloseTo(2.828);
});

test("getSeamLength: correctly gets seam length for seams with a single segment (line)", () => {
  const seam = { from: { x: 0, y: 0 }, to: { x: 1, y: 1 } };

  const result = getSeamLength(seam);
  expect(result).toBeCloseTo(1.414);
});

test("walkSeams: not throw  when seams are  of equal length", () => {
  const seam1 = { from: { x: 1, y: 1 }, to: { x: 0, y: 0 } };
  const seam2 = { from: { x: 2, y: 2 }, to: { x: 1, y: 1 } };

  expect(() => walkSeams(seam1, seam2)).not.toThrow();
});

test("walkSeams: throw when seams are not of equal length", () => {
  const seam1 = { from: { x: 1, y: 1 }, to: { x: 0, y: 0 } };
  const seam2 = { from: { x: 0, y: 0 }, to: { x: 10, y: 10 } };

  expect(() => walkSeams(seam1, seam2)).toThrow();
});
