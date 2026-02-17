// TODO: Add unit tests for all helper functions

import { expect, test } from "vitest";
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
  orthogonallyProjectPointOntoLine,
} from "./geometry.helpers";

test("midPoint: find the correct point in the middle of two points", () => {
  const pointA = { x: 3, y: 5 };
  const pointB = { x: 6, y: 4 };

  const middle = midPoint(pointA, pointB);
  expect(middle).toEqual({ x: 4.5, y: 4.5 });
});

test("curvePoints", () => {
  const necklineStart = { x: 0, y: 5 };
  const shoulderStart = { x: 8.57, y: 0 };
  const points = curvePoints(necklineStart, shoulderStart);

  expect(points.start).toEqual({ x: 0, y: 5 });
  expect(points.control1).toEqual({ x: expect.closeTo(5.99, 1), y: 5 });
  expect(points.control2).toEqual({ x: 8.57, y: 2.5 });
  expect(points.end).toEqual({ x: 8.57, y: 0 });
});

test("vectorFrom and getMagnitude: produce correct vector and magnitude", () => {
  const a = { x: 1, y: 2 };
  const b = { x: 4, y: 6 };

  const v = vectorFrom(a, b);
  expect(v).toEqual({ x: 3, y: 4 });
  expect(getMagnitude(v)).toBeCloseTo(5);
});

test("normalizeVector: returns unit vector and throws on zero vector", () => {
  const v = { x: 3, y: 4 };
  const n = normalizeVector(v);
  expect(n.x).toBeCloseTo(3 / 5);
  expect(n.y).toBeCloseTo(4 / 5);

  expect(() => normalizeVector({ x: 0, y: 0 })).toThrow();
});

test("det2 and dotProduct and angleBetweenVectors: known relationships", () => {
  const ux = { x: 1, y: 0 };
  const uy = { x: 0, y: 1 };

  expect(det2(ux, uy)).toBeCloseTo(1);
  expect(dotProduct(ux, uy)).toBeCloseTo(0);
  expect(angleBetweenVectors(ux, uy)).toBeCloseTo(Math.PI / 2, 6);
});

test("calculateSlope and getLineEquation: slope and intercept", () => {
  const p1 = { x: 0, y: 0 };
  const p2 = { x: 2, y: 2 };
  expect(calculateSlope(p1, p2)).toBeCloseTo(1);

  const line = { from: p1, to: p2 };
  const eq = getLineEquation(line);
  expect(eq.slope).toBeCloseTo(1);
  expect(eq.yIntercept).toBeCloseTo(0);

  // vertical line should throw
  expect(() => calculateSlope({ x: 1, y: 0 }, { x: 1, y: 2 })).toThrow();
});

test("reflectPointOverLine and orthogonallyProjectPointOntoLine: projections and reflections", () => {
  // project (1,1) onto horizontal line y=0 between x=-1 and x=1
  const lineH = { from: { x: -1, y: 0 }, to: { x: 1, y: 0 } };
  const p = { x: 1, y: 1 };
  const proj = orthogonallyProjectPointOntoLine(p, lineH);
  expect(proj).toEqual({ x: 1, y: 0 });

  // reflect across vertical line x=0
  const lineV = { from: { x: 0, y: -1 }, to: { x: 0, y: 1 } };
  const reflected = reflectPointOverLine({ x: 1, y: 1 }, lineV);
  expect(reflected).toEqual({ x: -1, y: 1 });
});

test("intersection: segment-segment, segment-ray, and ray-ray cases", () => {
  // segment-segment crossing
  const s1 = { from: { x: 0, y: 0 }, to: { x: 2, y: 2 } };
  const s2 = { from: { x: 0, y: 2 }, to: { x: 2, y: 0 } };
  expect(intersection.segmentSegment(s1, s2)).toEqual({ x: 1, y: 1 });

  // parallel segments -> null
  const s3 = { from: { x: 0, y: 0 }, to: { x: 2, y: 0 } };
  const s4 = { from: { x: 0, y: 1 }, to: { x: 2, y: 1 } };
  expect(intersection.segmentSegment(s3, s4)).toBeNull();

  // segment-ray intersection
  const lineSeg = { from: { x: 0, y: 0 }, to: { x: 2, y: 0 } };
  const ray = { origin: { x: 1, y: -1 }, direction: { x: 0, y: 1 } };
  expect(intersection.segmentRay(lineSeg, ray)).toEqual({ x: 1, y: 0 });

  // segment-ray where intersection lies outside the segment bounds -> null
  const rayOutside = { origin: { x: 3, y: -1 }, direction: { x: 0, y: 1 } };
  expect(intersection.segmentRay(lineSeg, rayOutside)).toBeNull();

  // ray-ray intersection
  const ray1 = { origin: { x: 0, y: 0 }, direction: { x: 1, y: 1 } };
  const ray2 = { origin: { x: 1, y: 0 }, direction: { x: 0, y: 1 } };
  expect(intersection.rayRay(ray1, ray2)).toEqual({ x: 1, y: 1 });

  // ray-ray where intersection occurs before one ray's origin -> null
  const rayA = { origin: { x: 0, y: 0 }, direction: { x: 1, y: 0 } };
  const rayB = { origin: { x: 1, y: 1 }, direction: { x: 0, y: 1 } };
  expect(intersection.rayRay(rayA, rayB)).toBeNull();
});

test("rotateAboutPoint and translatePoint: transform points", () => {
  const center = { x: 0, y: 0 };
  const point = { x: 1, y: 0 };
  const rotated = rotateAboutPoint(center, point, Math.PI / 2);
  expect(rotated.x).toBeCloseTo(0);
  expect(rotated.y).toBeCloseTo(1);

  const translated = translatePoint(point, 2, 3);
  expect(translated).toEqual({ x: 3, y: 3 });
});

test("lineLength: returns correct length for a line and zero length for identical points", () => {
  const line = { from: { x: 0, y: 0 }, to: { x: 3, y: 4 } };
  expect(lineLength(line)).toBeCloseTo(5);

  const zero = { from: { x: 1, y: 1 }, to: { x: 1, y: 1 } };
  expect(lineLength(zero)).toBeCloseTo(0);
});
