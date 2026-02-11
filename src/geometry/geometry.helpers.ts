import {
  AxisEnumMap,
  type CubicBezier,
  type CurveControl,
  type Line,
  type Point,
  type Ray,
  type Vector,
} from "./geometry.types";

/**
 * Creates a vector from point1 to point2.
 * The resulting vector represents the displacement needed
 * to move from point1 to point2.
 *
 * @param point1 The starting point.
 * @param point2 The ending point.
 * @returns A vector with x and y components (dx, dy).
 */
export const vectorFrom = (point1: Point, point2: Point): Vector => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;

  return { x: dx, y: dy };
};

/**
 * Computes the magnitude (length) of a vector.
 * The magnitude is defined as the Euclidean norm:
 * √(x² + y²).
 *
 * @param vector The vector whose length is being calculated.
 */
export const getMagnitude = (vector: Vector): number => {
  return Math.abs(Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2)));
};

/**
 * Normalizes a vector (scales it to unit length).
 * The resulting vector has magnitude 1 while preserving direction.
 *
 * @param vector The vector to normalize.
 * @returns A unit vector pointing in the same direction.
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
 *
 * @param vector1 The first vector.
 * @param vector2 The second vector.
 */
export const det2 = (vector1: Vector, vector2: Vector): number => {
  return vector1.x * vector2.y - vector1.y * vector2.x;
};

/**
 * Calculates the slope of the line defined by two points.
 * Slope is defined as rise over run (dy / dx).
 *
 * @param point1 The first point of the line.
 * @param point2 The second point of the line.
 * @throws Error if the line is vertical (dx = 0).
 */
export const calculateSlope = (point1: Point, point2: Point): number => {
  const vector = vectorFrom(point1, point2);
  if (vector.x === 0) {
    throw new Error("Slope is undefined for vertical lines.");
  }
  return vector.y / vector.x;
};

/**
 * Calculates the dot product of two vectors.
 *
 * @param vector1 The first vector
 * @param vector2 The second vector
 */
export const dotProduct = (vector1: Vector, vector2: Vector): number => {
  return vector1.x * vector2.x + vector1.y * vector2.y;
};

/**
 * Calculates the smallest angle between two vectors.
 * Uses the dot product to find the cosine of the angle, then applies arccosine to get the angle in radians.
 *
 * @param vector1 The first vector.
 * @param vector2 The second vector.
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

/**
 * Computes the intersection point between a line segment
 * and a ray using their parametric forms.
 *
 * The line is treated as a finite segment between
 * line.from and line.to.
 * The ray is defined by an origin point and a direction vector,
 * extending infinitely in the positive direction.
 *
 * Returns null if:
 * - The line and ray are parallel (or nearly parallel),
 * - The intersection lies outside the line segment,
 * - The intersection lies behind the ray origin.
 *
 * @param line The line segment.
 * @param ray The ray (origin + direction).
 */
export const intersectionOfLineAndRay = (
  line: Line,
  ray: Ray,
): Point | null => {
  // parametric form of line: L(t) = line.from + t * vectorFromLine
  // parametric form of ray: R(s) = ray.origin + s * ray.direction
  // if there's an intersection, then L(t) = R(s) for some t and s >= 0

  const p = line.from;
  const r = vectorFrom(line.from, line.to);
  const q = ray.origin;
  const s = ray.direction;

  const rsDet = det2(r, s);

  if (Math.abs(rsDet) < 1e-10) {
    // lines are parallel or almost parallel, so no intersection
    return null;
  }

  const qpMinus = vectorFrom(p, q);

  const t = det2(qpMinus, s) / rsDet;
  const u = det2(qpMinus, r) / rsDet;

  if (t < 0 || t > 1) return null; // point lies on segment
  if (u < 0) return null; //point lies on ray

  return {
    x: p.x + t * r.x,
    y: p.y + t * r.y,
  };
};

/**
 * Rotates a point around a given center by a specified angle.
 * Uses standard 2D rotation matrix transformation.
 *
 * @param centerOfRotation The pivot point around which rotation occurs.
 * @param pointToRotate The point to rotate.
 * @param angleInRadians The rotation angle in radians (counterclockwise).
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
 * @param point The point to project.
 * @param line The reference line used as the projection base.
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
