export type Point = {
  x: number;
  y: number;
};

export type Line = {
  from: Point;
  to: Point;
};

export type Vector = {
  x: number;
  y: number;
};

export type Ray = {
  origin: Point;
  direction: Vector;
};

export type Range = {
  min: number;
  max: number;
};

export interface Intersection {
  /**
   * Computes the intersection of two line segments.
   * The intersection must lie within both segment bounds.
   */
  segmentSegment(line1: Line, line2: Line): Point | null;

  /**
   * Computes the intersection of a line segment and a ray.
   * The intersection must lie within the segment
   * and in the forward direction of the ray.
   */
  segmentRay(line: Line, ray: Ray): Point | null;

  /**
   * Computes the intersection of two rays.
   * The intersection must lie in the forward
   * direction of both rays.
   */
  rayRay(ray1: Ray, ray2: Ray): Point | null;
}

export const IntersectionRangeEnumMap = {
  LINE: { min: 0, max: 1 },
  RAY: { min: 0, max: Infinity },
};

export type IntersectionType = keyof typeof IntersectionRangeEnumMap;

export type CubicBezier = {
  start: Point;
  control1: Point;
  control2: Point;
  end: Point;
};

export type BezierPath = {
  segments: Array<CubicBezier>;
};

type Axis = "x" | "y";

export const AxisEnumMap = {
  HORIZONTAL: "x",
  VERTICAL: "y",
} as const;

export type CurveControl = {
  axis: Axis;
  tension: number;
};

export type BoundingBox = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};
