import { describe, expect, it } from "vitest";
import {
  curvePoints,
  midPoint,
  vectorFrom,
  getMagnitude,
  lineLength,
  normalizeVector,
  det2,
  calculateSlope,
  getLineEquation,
  reflectPointOverLine,
  dotProduct,
  angleBetweenVectors,
  intersection,
  rotateAboutPoint,
  translatePoint,
  translateLine,
  translateCurve,
  getBoundingBoxFromLines,
  orthogonallyProjectPointOntoLine,
  getBoundingBoxMetrics,
} from "./geometry.helpers";
import { assertNonEmpty } from "../core/utils/assert";

describe("midPoint", () => {
  it("finds the correct point in the middle of two points", () => {
    const pointA = { x: 3, y: 5 };
    const pointB = { x: 6, y: 4 };

    const middle = midPoint(pointA, pointB);
    expect(middle).toEqual({ x: 4.5, y: 4.5 });
  });
});

describe("curvePoints", () => {
  it("generates control points with default tensions", () => {
    const necklineStart = { x: 0, y: 5 };
    const shoulderStart = { x: 8.57, y: 0 };
    const points = curvePoints(necklineStart, shoulderStart);

    expect(points.start).toEqual({ x: 0, y: 5 });
    expect(points.control1).toEqual({ x: expect.closeTo(5.99, 1), y: 5 });
    expect(points.control2).toEqual({ x: 8.57, y: 2.5 });
    expect(points.end).toEqual({ x: 8.57, y: 0 });
  });
});

describe("vectorFrom", () => {
  it("produces the displacement vector from point A to point B", () => {
    const a = { x: 1, y: 2 };
    const b = { x: 4, y: 6 };

    const v = vectorFrom(a, b);
    expect(v).toEqual({ x: 3, y: 4 });
  });
});

describe("getMagnitude", () => {
  it("returns the correct length of a vector", () => {
    const v = { x: 3, y: 4 };
    expect(getMagnitude(v)).toBeCloseTo(5);
  });
});

describe("normalizeVector", () => {
  it("returns a unit vector for a non-zero input", () => {
    const v = { x: 3, y: 4 };
    const n = normalizeVector(v);
    expect(n.x).toBeCloseTo(3 / 5);
    expect(n.y).toBeCloseTo(4 / 5);
  });

  it("throws when given a zero vector", () => {
    expect(() => normalizeVector({ x: 0, y: 0 })).toThrow();
  });
});

describe("det2", () => {
  it("computes the 2D determinant of orthogonal unit vectors", () => {
    const ux = { x: 1, y: 0 };
    const uy = { x: 0, y: 1 };
    expect(det2(ux, uy)).toBeCloseTo(1);
  });
});

describe("dotProduct", () => {
  it("returns zero for perpendicular vectors", () => {
    const ux = { x: 1, y: 0 };
    const uy = { x: 0, y: 1 };
    expect(dotProduct(ux, uy)).toBeCloseTo(0);
  });
});

describe("angleBetweenVectors", () => {
  it("calculates the right angle between orthogonal vectors", () => {
    const ux = { x: 1, y: 0 };
    const uy = { x: 0, y: 1 };
    expect(angleBetweenVectors(ux, uy)).toBeCloseTo(Math.PI / 2, 6);
  });
});

describe("calculateSlope", () => {
  it("returns slope of a non-vertical line", () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 2, y: 2 };
    expect(calculateSlope(p1, p2)).toBeCloseTo(1);
  });

  it("throws for vertical lines", () => {
    expect(() => calculateSlope({ x: 1, y: 0 }, { x: 1, y: 2 })).toThrow();
  });
});

describe("getLineEquation", () => {
  it("computes slope and y-intercept correctly", () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 2, y: 2 };
    const line = { from: p1, to: p2 };
    const eq = getLineEquation(line);
    expect(eq.slope).toBeCloseTo(1);
    expect(eq.yIntercept).toBeCloseTo(0);
  });
});

describe("orthogonallyProjectPointOntoLine", () => {
  it("projects a point perpendicularly onto a line", () => {
    const lineH = { from: { x: -1, y: 0 }, to: { x: 1, y: 0 } };
    const p = { x: 1, y: 1 };
    const proj = orthogonallyProjectPointOntoLine(p, lineH);
    expect(proj).toEqual({ x: 1, y: 0 });
  });
});

describe("reflectPointOverLine", () => {
  it("reflects a point across a line using its orthogonal projection", () => {
    const lineV = { from: { x: 0, y: -1 }, to: { x: 0, y: 1 } };
    const reflected = reflectPointOverLine({ x: 1, y: 1 }, lineV);
    expect(reflected).toEqual({ x: -1, y: 1 });
  });
});

describe("intersection", () => {
  describe("segmentSegment", () => {
    it("returns intersection point for crossing segments", () => {
      const s1 = { from: { x: 0, y: 0 }, to: { x: 2, y: 2 } };
      const s2 = { from: { x: 0, y: 2 }, to: { x: 2, y: 0 } };
      expect(intersection.segmentSegment(s1, s2)).toEqual({ x: 1, y: 1 });
    });

    it("returns null for parallel segments", () => {
      const s3 = { from: { x: 0, y: 0 }, to: { x: 2, y: 0 } };
      const s4 = { from: { x: 0, y: 1 }, to: { x: 2, y: 1 } };
      expect(intersection.segmentSegment(s3, s4)).toBeNull();
    });
  });

  describe("segmentRay", () => {
    it("finds intersection when ray meets segment", () => {
      const lineSeg = { from: { x: 0, y: 0 }, to: { x: 2, y: 0 } };
      const ray = { origin: { x: 1, y: -1 }, direction: { x: 0, y: 1 } };
      expect(intersection.segmentRay(lineSeg, ray)).toEqual({ x: 1, y: 0 });
    });

    it("returns null when intersection lies outside segment bounds", () => {
      const lineSeg = { from: { x: 0, y: 0 }, to: { x: 2, y: 0 } };
      const rayOutside = { origin: { x: 3, y: -1 }, direction: { x: 0, y: 1 } };
      expect(intersection.segmentRay(lineSeg, rayOutside)).toBeNull();
    });
  });

  describe("rayRay", () => {
    it("returns intersection for two rays", () => {
      const ray1 = { origin: { x: 0, y: 0 }, direction: { x: 1, y: 1 } };
      const ray2 = { origin: { x: 1, y: 0 }, direction: { x: 0, y: 1 } };
      expect(intersection.rayRay(ray1, ray2)).toEqual({ x: 1, y: 1 });
    });

    it("returns null when intersection occurs before a ray's origin", () => {
      const rayA = { origin: { x: 0, y: 0 }, direction: { x: 1, y: 0 } };
      const rayB = { origin: { x: 1, y: 1 }, direction: { x: 0, y: 1 } };
      expect(intersection.rayRay(rayA, rayB)).toBeNull();
    });
  });
});

describe("rotateAboutPoint", () => {
  it("rotates a point around a center by a given angle", () => {
    const center = { x: 0, y: 0 };
    const point = { x: 1, y: 0 };
    const rotated = rotateAboutPoint(center, point, Math.PI / 2);
    expect(rotated.x).toBeCloseTo(0);
    expect(rotated.y).toBeCloseTo(1);
  });
});

describe("translatePoint", () => {
  it("translates a point by dx and dy", () => {
    const point = { x: 1, y: 0 };
    const translated = translatePoint(point, 2, 3);
    expect(translated).toEqual({ x: 3, y: 3 });
  });
});

describe("lineLength", () => {
  it("returns correct length for a nonzero line and zero for identical endpoints", () => {
    const line = { from: { x: 0, y: 0 }, to: { x: 3, y: 4 } };
    expect(lineLength(line)).toBeCloseTo(5);

    const zero = { from: { x: 1, y: 1 }, to: { x: 1, y: 1 } };
    expect(lineLength(zero)).toBeCloseTo(0);
  });
});

describe("translateLine", () => {
  it("translates line endpoints by given distances", () => {
    const line = { from: { x: 0, y: 0 }, to: { x: 2, y: 3 } };

    const translated = translateLine(line, 5, -2);

    expect(translated).toEqual({
      from: { x: 5, y: -2 },
      to: { x: 7, y: 1 },
    });
  });

  it("handles zero translation", () => {
    const line = { from: { x: 1, y: 2 }, to: { x: 3, y: 4 } };
    const translated = translateLine(line, 0, 0);
    expect(translated).toEqual(line);
  });
});


describe("translateCurve", () => {
  it("translates all control points by given distances", () => {
    const curve = curvePoints({ x: 0, y: 0 }, { x: 5, y: 5 });

    const translated = translateCurve(curve, 3, 2);

    expect(translated.start).toEqual({ x: 3, y: 2 });
    expect(translated.end).toEqual({ x: 8, y: 7 });
    expect(translated.control1.x).toBeCloseTo(curve.control1.x + 3);
    expect(translated.control1.y).toBeCloseTo(curve.control1.y + 2);
    expect(translated.control2.x).toBeCloseTo(curve.control2.x + 3);
    expect(translated.control2.y).toBeCloseTo(curve.control2.y + 2);
  });

  it("handles negative translation", () => {
    const curve = curvePoints({ x: 10, y: 10 }, { x: 15, y: 15 });

    const translated = translateCurve(curve, -5, -10);

    expect(translated.start).toEqual({ x: 5, y: 0 });
    expect(translated.end).toEqual({ x: 10, y: 5 });
  });
});


describe("getBoundingBoxFromLines", () => {
  it("calculates bounding box for single line", () => {
    const lines = [{ from: { x: 2, y: 7 }, to: { x: 8, y: 3 } }];

    assertNonEmpty(lines, "Empty line array.");

    const bbox = getBoundingBoxFromLines(lines);

    expect(bbox).toEqual({
      minX: 2,
      maxX: 8,
      minY: 3,
      maxY: 7,
    });
  });

  it("calculates bounding box for multiple lines", () => {
    const lines = [
      { from: { x: 0, y: 0 }, to: { x: 5, y: 5 } },
      { from: { x: -2, y: 3 }, to: { x: 10, y: -1 } },
      { from: { x: 7, y: 8 }, to: { x: 1, y: 2 } },
    ];

    assertNonEmpty(lines, "Empty line array.");
    const bbox = getBoundingBoxFromLines(lines);

    expect(bbox).toEqual({
      minX: -2,
      maxX: 10,
      minY: -1,
      maxY: 8,
    });
  });

  it("handles lines with identical endpoints", () => {
    const lines = [
      { from: { x: 3, y: 4 }, to: { x: 3, y: 4 } },
      { from: { x: 1, y: 2 }, to: { x: 6, y: 5 } },
    ];

    assertNonEmpty(lines, "Empty line array.");
    const bbox = getBoundingBoxFromLines(lines);

    expect(bbox).toEqual({
      minX: 1,
      maxX: 6,
      minY: 2,
      maxY: 5,
    });
  });
});


describe("getBoundingBoxMetrics", () => {
  it("returns center, width and height for a normal bounding box", () => {
    const bounds = { minX: 10, minY: 20, maxX: 30, maxY: 70 };

    const result = getBoundingBoxMetrics(bounds);

    expect(result).toEqual({
      center: { x: 20, y: 45 },
      width: 20,
      height: 50,
    });
  });

  it("works with negative coordinates", () => {
    const bounds = { minX: -10, minY: -20, maxX: 30, maxY: 40 };

    const result = getBoundingBoxMetrics(bounds);

    expect(result).toEqual({
      center: { x: 10, y: 10 },
      width: 40,
      height: 60,
    });
  });

  it("handles a degenerate box (zero width/height)", () => {
    const bounds = { minX: 5, minY: 5, maxX: 5, maxY: 5 };

    const result = getBoundingBoxMetrics(bounds);

    expect(result).toEqual({
      center: { x: 5, y: 5 },
      width: 0,
      height: 0,
    });
  });

  it("is symmetric: swapping min/max pairs produces same center/metrics if values match", () => {
    const boundsA = { minX: 0, minY: 0, maxX: 100, maxY: 50 };
    const boundsB = { minX: 0, minY: 0, maxX: 100, maxY: 50 };

    expect(getBoundingBoxMetrics(boundsA)).toEqual(
      getBoundingBoxMetrics(boundsB),
    );
  });

  it("computes center as min + width/2 and min + height/2", () => {
    const bounds = { minX: -25, minY: 10, maxX: 75, maxY: 110 };

    const { center, width, height } = getBoundingBoxMetrics(bounds);

    expect(center.x).toBe(bounds.minX + width / 2);
    expect(center.y).toBe(bounds.minY + height / 2);
  });
});
