import type { CubicBezier, Point } from "./geometry.types";

/**
 * Returns the midpoint between points two points.
 * @param a The first point.
 * @param b The second point.
 */
export const midPoint = (a: Point, b: Point): Point => {
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;

  return { x: midX, y: midY };
};

/**
 * Translates a point by given distances in x and y directions.
 * @param point The first point.
 * @param dx The horizontal translation distance.
 * @param dy The vertical translation distance.
 */
export const translatePoint = (
  point: Point,
  dx: number = 0,
  dy: number = 0,
): Point => {
  return { x: point.x + dx, y: point.y + dy };
};

/**
 * Generates control points for a cubic Bezier curve between two points.
 * @param start The starting point of the curve.
 * @param end The ending point of the curve.
 * @param control1Multiplier Multiplier for the first control point's distance from the start point (default is 0.7).
 * @param control2Multiplier Multiplier for the second control point's distance from the end point (default is 0.5).
 */
export const curvePoints = (
  start: Point,
  end: Point,
  control1Multiplier: number = 0.7,
  control2Multiplier: number = 0.5,
): CubicBezier => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  return {
    start,
    control1: {
      x: start.x + dx * control1Multiplier,
      y: start.y,
    },
    control2: {
      x: end.x,
      y: end.y - dy * control2Multiplier,
    },
    end,
  };
};
