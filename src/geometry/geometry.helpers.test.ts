import { expect, test } from "vitest";
import { curvePoints, midPoint } from "./geometry.helpers";

test("midPoint: find the correct point in the middle of two points", () => {
  const pointA = { x: 3, y: 5 };
  const pointB = { x: 6, y: 4 };

  const middle = midPoint(pointA, pointB);
  expect(middle).toEqual({ x: 4.5, y: 4.5 });
})

test("curvePoints", () => {
  const necklineStart = { x: 0, y: 5 };
  const shoulderStart = { x: 8.57, y: 0 };
  const points = curvePoints(necklineStart, shoulderStart);

  expect(points.start).toEqual({ x: 0, y: 5 });
  expect(points.control1).toEqual({ x: expect.closeTo(5.99, 1), y: 5 });
  expect(points.control2).toEqual({ x: 8.57, y: 2.5 });
  expect(points.end).toEqual({ x: 8.57, y: 0 });
});
