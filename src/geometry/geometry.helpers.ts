import {
  AxisEnumMap,
  IntersectionRangeEnumMap,
  type CubicBezier,
  type CurveControl,
  type Intersection,
  type IntersectionType,
  type Line,
  type Point,
  type Vector,
} from "./geometry.types";

/**
 * Creates a vector from `point1` to `point2`.
 *
 * The resulting vector represents the displacement needed
 * to move from `point1` to `point2`.
 */
export const vectorFrom = (point1: Point, point2: Point): Vector => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;

  return { x: dx, y: dy };
};

/**
 * Computes the magnitude (length) of a vector.
 *
 * @param vector The vector whose length is being calculated.
 */
export const getMagnitude = (vector: Vector): number => {
  return Math.abs(Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2)));
};

/**
 * Normalizes a vector.
 *
 * @throws Error if the vector has zero magnitude.
 */
export const normalizeVector = (vector: Vector): Vector => {
  const magnitude = getMagnitude(vector);
  if (magnitude === 0) {
    throw new Error("Cannot normalize a zero vector.");
  }
  const normalizedVector = { x: vector.x / magnitude, y: vector.y / magnitude };

  return normalizedVector;
};

/**
 * Computes the 2D determinant (cross product scalar value)
 * of two vectors.
 *
 * Geometrically, this represents the signed area of the
 * parallelogram spanned by the vectors. It is useful for:
 * - Testing orientation (clockwise vs counterclockwise)
 * - Detecting parallel vectors
 * - Computing intersections
 */
export const det2 = (vector1: Vector, vector2: Vector): number => {
  return vector1.x * vector2.y - vector1.y * vector2.x;
};

/**
 * Calculates the slope of the line defined by two points.
 * Slope is defined as rise over run (dy / dx).
 *
 * @throws Error if the line is vertical (dx = 0).
 */
export const calculateSlope = (point1: Point, point2: Point): number => {
  const vector = vectorFrom(point1, point2);
  if (vector.x === 0) {
    throw new Error("Slope is undefined for vertical lines.");
  }
  return vector.y / vector.x;
};

export const getLineEquation = (line: Line) => {
  const slope = calculateSlope(line.from, line.to);
  const yIntercept = line.from.y - slope * line.from.x;

  return { slope, yIntercept };
};

export const reflectPointOverLine = (point: Point, line: Line) => {
  const orthogonalProjection = orthogonallyProjectPointOntoLine(point, line);

  const reflectedPoint = {
    x: 2 * orthogonalProjection.x - point.x,
    y: 2 * orthogonalProjection.y - point.y,
  };

  return reflectedPoint;
};

/**
 * Calculates the dot product of two vectors.
 */
export const dotProduct = (vector1: Vector, vector2: Vector): number => {
  return vector1.x * vector2.x + vector1.y * vector2.y;
};

/**
 * Calculates the smallest angle between two vectors.
 *
 * @returns The absolute angle between the two vectors in radians.
 * @throws Error if either vector has zero magnitude.
 */
export const angleBetweenVectors = (
  vector1: Vector,
  vector2: Vector,
): number => {
  const magnitude1 = getMagnitude(vector1);
  const magnitude2 = getMagnitude(vector2);

  const angleInRadians = Math.acos(
    dotProduct(vector1, vector2) / (magnitude1 * magnitude2),
  );

  return Math.abs(angleInRadians);
};

const findIntersection = (
  origin1: Point,
  direction1: Vector,
  type1: IntersectionType,
  origin2: Point,
  direction2: Vector,
  type2: IntersectionType,
): Point | null => {
  // parametric form of line: L(t) = line.from + t * vectorFromLine = p + r * t
  // parametric form of ray: R(s) = ray.origin + s * ray.direction = q + d * s
  // if there's an intersection, then L(t) = R(s) for some t and s >= 0

  const determinant = det2(direction1, direction2);

  if (Math.abs(determinant) < 1e-10) {
    // lines are parallel or almost parallel, so no intersection
    return null;
  }

  const qpMinus = vectorFrom(origin1, origin2);

  const t = det2(qpMinus, direction2) / determinant;
  const s = det2(qpMinus, direction1) / determinant;

  const intersectionRange1 = IntersectionRangeEnumMap[type1];
  const intersectionRange2 = IntersectionRangeEnumMap[type2];

  if (t < intersectionRange1.min || t > intersectionRange1.max) return null;
  if (s < intersectionRange2.min || s > intersectionRange2.max) return null;

  return {
    x: origin1.x + t * direction1.x,
    y: origin1.y + t * direction1.y,
  };
};

/**
 * Computes the intersection point between line segments
 * and/or rays using their parametric forms.
 */
export const intersection: Intersection = {
  segmentSegment(line1, line2) {
    const p = line1.from;
    const r = vectorFrom(line1.from, line1.to);
    const q = line2.from;
    const d = vectorFrom(line2.from, line2.to);

    return findIntersection(p, r, "LINE", q, d, "LINE");
  },

  segmentRay(line, ray) {
    const p = line.from;
    const r = vectorFrom(line.from, line.to);
    const q = ray.origin;
    const d = ray.direction;

    return findIntersection(p, r, "LINE", q, d, "RAY");
  },

  rayRay(ray1, ray2) {
    const p = ray1.origin;
    const r = ray1.direction;
    const q = ray2.origin;
    const d = ray2.direction;

    return findIntersection(p, r, "RAY", q, d, "RAY");
  },
};

/**
 * Rotates a point around a given center by a specified angle.
 * Uses standard 2D rotation matrix transformation.
 *
 */
export const rotateAboutPoint = (
  centerOfRotation: Point,
  pointToRotate: Point,
  angleInRadians: number,
): Point => {
  const translatedPoint: Point = {
    x: pointToRotate.x - centerOfRotation.x,
    y: pointToRotate.y - centerOfRotation.y,
  };

  const xPrime =
    translatedPoint.x * Math.cos(angleInRadians) -
    translatedPoint.y * Math.sin(angleInRadians);
  const yPrime =
    translatedPoint.y * Math.cos(angleInRadians) +
    translatedPoint.x * Math.sin(angleInRadians);

  const rotatedPoint = {
    x: xPrime + centerOfRotation.x,
    y: yPrime + centerOfRotation.y,
  };

  return rotatedPoint;
};

/**
 * Returns the midpoint between points two points.
 */
export const midPoint = (a: Point, b: Point): Point => {
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;

  return { x: midX, y: midY };
};

// TODO: Decide whether to do something similar to intersection and create 'drop', 'raise', 'square' etc
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

// TODO: Change orthogonallyProjectPointOntoLine into vector terms
// Explore using orthogonal projection to 'square' points
/**
 * Orthogonally projects a point onto an infinite line.
 *
 * In pattern drafting terms, this constructs the foot of the
 * perpendicular dropped from a point onto a reference line.
 * The resulting point lies on the line and represents the
 * shortest distance between the original point and that line.
 *
 * The projection is computed using vector projection in
 * parametric form. The target line is treated as infinite,
 * not clamped to a segment.
 *
 */
export const orthogonallyProjectPointOntoLine = (
  point: Point,
  line: Line,
): Point => {
  const { from, to } = line;

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  const lengthSq = dx * dx + dy * dy;

  // Parameter t along the line
  const t = ((point.x - from.x) * dx + (point.y - from.y) * dy) / lengthSq;

  return {
    x: from.x + t * dx,
    y: from.y + t * dy,
  };
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
  control1: CurveControl = { axis: AxisEnumMap.HORIZONTAL, tension: 0.7 },
  control2: CurveControl = { axis: AxisEnumMap.VERTICAL, tension: 0.5 },
): CubicBezier => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  return {
    start,
    control1: {
      x:
        control1.axis === AxisEnumMap.HORIZONTAL
          ? start.x + dx * control1.tension
          : start.x,
      y:
        control1.axis === AxisEnumMap.VERTICAL
          ? start.y + dy * control1.tension
          : start.y,
    },
    control2: {
      x:
        control2.axis === AxisEnumMap.HORIZONTAL
          ? end.x - dx * control2.tension
          : end.x,
      y:
        control2.axis === AxisEnumMap.VERTICAL
          ? end.y - dy * control2.tension
          : end.y,
    },
    end,
  };
};
