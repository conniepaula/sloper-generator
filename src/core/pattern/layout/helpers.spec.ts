import { describe, expect, it } from "vitest";

import type { Entity } from "../drafting/types";
import {
  computeBounds,
  extractExportableLines,
  extractLines,
  translateAnnotation,
  translateEntity,
} from "./helpers";
import { curvePoints } from "../../../geometry/helpers";

describe("translateEntity", () => {
  it("translates line geometry while preserving metadata", () => {
    const line = { from: { x: 0, y: 0 }, to: { x: 1, y: 1 } };
    const entity: Entity = {
      id: "front_line1",
      kind: "line",
      geometry: line,
      role: "guide",
      piece: "front",
      name: "Test Line",
      exportable: true,
    };

    const translated = translateEntity(entity, 5, 3) as Extract<
      Entity,
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

  it("translates curve geometry while preserving metadata", () => {
    const curve = curvePoints({ x: 0, y: 0 }, { x: 5, y: 5 });
    const entity: Entity = {
      id: "front_curve1",
      kind: "curve",
      geometry: curve,
      role: "main_outer",
      piece: "front",
      name: "Test Curve",
      exportable: true,
    };

    const translated = translateEntity(entity, 2, -1) as Extract<
      Entity,
      { kind: "curve" }
    >;

    expect(translated.kind).toBe("curve");
    expect(translated.geometry.start).toEqual({ x: 2, y: -1 });
    expect(translated.geometry.end).toEqual({ x: 7, y: 4 });
    expect(translated.role).toBe("main_outer");
    expect(translated.piece).toBe("front");
    expect(translated.name).toBe("Test Curve");
  });
});

describe("translateAnnotation", () => {
  it("translates cut-on-fold annotation geometry while preserving metadata", () => {
    const annotation = {
      id: "front_cut_on_fold",
      type: "cut_on_fold" as const,
      shape: {
        startPoint: { x: 0, y: 0 },
        width: 12,
        height: 40,
      },
    };

    const translated = translateAnnotation(annotation, 5, 3);

    expect(translated.type).toBe("cut_on_fold");
    expect(translated.shape).toEqual({
      startPoint: { x: 5, y: 3 },
      width: 12,
      height: 40,
    });
    expect(translated.id).toBe("front_cut_on_fold");
  });
});

describe("computeBounds", () => {
  it("returns the bounding box computed from exportable lines", () => {
    const line1 = { from: { x: 0, y: 0 }, to: { x: 1, y: 1 } };
    const line2 = { from: { x: 2, y: 2 }, to: { x: 3, y: 3 } };
    const curve = curvePoints({ x: 0, y: 0 }, { x: 5, y: 5 });

    const entities: Array<Entity> = [
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

    const result = computeBounds(entities);

    expect(result).toEqual({
      minX: 0,
      minY: 0,
      maxX: 1,
      maxY: 1,
    });
  });

  it("throws when there are no exportable lines", () => {
    const line = { from: { x: 2, y: 2 }, to: { x: 3, y: 3 } };
    const curve = curvePoints({ x: 0, y: 0 }, { x: 5, y: 5 });

    const entities: Array<Entity> = [
      {
        id: "front_curve",
        kind: "curve",
        geometry: curve,
        role: "main_outer",
        piece: "front",
        name: "Curve",
        exportable: true,
      },
      {
        id: "front_line",
        kind: "line",
        geometry: line,
        role: "construction",
        piece: "front",
        name: "Line",
        exportable: false,
      },
    ];

    expect(() => computeBounds(entities)).toThrow();
  });

  it("throws when array is empty", () => {
    const entities: Array<Entity> = [];
    expect(() => computeBounds(entities)).toThrow();
  });
});

describe("extractLines", () => {
  it("extracts only line geometries from mixed entities", () => {
    const line1 = { from: { x: 0, y: 0 }, to: { x: 1, y: 1 } };
    const line2 = { from: { x: 2, y: 2 }, to: { x: 3, y: 3 } };
    const curve = curvePoints({ x: 0, y: 0 }, { x: 5, y: 5 });

    const entities: Array<Entity> = [
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
});

describe("extractExportableLines", () => {
  it("extracts only exportable line geometries", () => {
    const line1 = { from: { x: 0, y: 0 }, to: { x: 1, y: 1 } };
    const line2 = { from: { x: 2, y: 2 }, to: { x: 3, y: 3 } };
    const curve = curvePoints({ x: 0, y: 0 }, { x: 5, y: 5 });

    const entities: Array<Entity> = [
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
});
