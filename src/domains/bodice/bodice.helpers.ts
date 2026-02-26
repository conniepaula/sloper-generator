import type { Line, Point, Ray } from "../../geometry/geometry.types";
import {
  angleBetweenVectors,
  midPoint,
  normalizeVector,
  reflectPointOverLine,
  rotateAboutPoint,
  vectorFrom,
  intersection,
} from "../../geometry/geometry.helpers";
import { ADDED_ARMSCYE_DEPTH, ORIGIN } from "./bodice.constants";
import { BodiceError } from "./bodice.errors";

/**
 * Compute the bust dart intake (difference between front and back waist heights).
 * Returns the raw difference but caps the intake at 5, as that's what's recommended for first iteration bodice slopers.
 */
export const calculateBustDartIntake = (
  frontWaistHeight: number,
  backWaistHeight: number,
) => {
  const dartDepth = frontWaistHeight - backWaistHeight;

  // first iteration bodice should not have bust dart intake larger than 5
  if (dartDepth > 5) {
    return 5;
  }

  return dartDepth;
};

/**
 * Armscye line vertical position measured from origin.
 * Uses half the front waist height plus a small added depth constant.
 */
export const armscyeLineHeight = (frontWaistHeight: number) =>
  frontWaistHeight / 2 + ADDED_ARMSCYE_DEPTH;

/**
 * Calculates waistline length from waist measurement.
 * Accounts for added waist dart depth.
 */
export const waistLineLength = (waist: number, waistDartDepth: number) =>
  waist / 4 + waistDartDepth;

/**
 * Computes horizontal distance from origin to the shoulder point.
 * Uses the shoulder span, shoulder length and slope to compute the offset.
 */
export const originToShoulderDistance = (
  shoulderSpan: number,
  shoulderLength: number,
  shoulderSlope: number,
) => {
  return (
    shoulderSpan / 2 -
    Math.sqrt(Math.pow(shoulderLength, 2) - Math.pow(shoulderSlope, 2))
  );
};

/**
 * Generic starting points for a bodice draft.
 * `centerTop` is at the origin; `centerBottom` is offset by `height`.
 */
export const createBaseCenterPoints = (
  height: number,
  origin: Point = ORIGIN,
) => {
  return {
    centerTop: origin,
    centerBottom: {
      x: origin.x,
      y: origin.y + height,
    },
  };
};

/**
 * Computes normalized direction vectors for a dart and the geometric
 * relationships needed to perform dart folding operations.
 *
 */
export const getDartVectorsAndRelations = (
  dartOrigin: Point,
  stationaryDart: Point,
  movableDart: Point,
) => {
  const originalStationaryDartVector = normalizeVector(
    vectorFrom(dartOrigin, stationaryDart),
  );
  const originalMovableDartVector = normalizeVector(
    vectorFrom(dartOrigin, movableDart),
  );
  const angleBetweenDartVectors = angleBetweenVectors(
    originalStationaryDartVector,
    originalMovableDartVector,
  );

  const foldBoundaryRay: Ray = {
    origin: dartOrigin,
    direction: originalStationaryDartVector,
  };

  return {
    originalStationaryDartVector,
    originalMovableDartVector,
    angleBetweenDartVectors,
    foldBoundaryRay,
  };
};

/**
 * Simulates folding the bust dart: rotates the side waist point about the dart origin
 * by the negative angle to produce the folded side seam.
 */
export const foldBustDart = (
  bustDartOrigin: Point,
  angleBetweenDartVectors: number,
  armScyeEnd: Point,
  sideWaist: Point,
) => {
  const foldedSideSeam = {
    from: armScyeEnd,
    to: rotateAboutPoint(bustDartOrigin, sideWaist, -angleBetweenDartVectors),
  };

  return foldedSideSeam;
};

export const unfoldBustDart = (
  foldedSideSeamLine: Line,
  bustDartOrigin: Point,
  armscyeEnd: Point,
  angleBetweenDartVectors: number,
  foldBoundaryRay: Ray,
) => {
  const splitPoint = intersection.segmentRay(
    foldedSideSeamLine,
    foldBoundaryRay,
  );

  if (splitPoint === null) {
    throw new BodiceError(
      "Invalid dart geometry: Fold boundary ray does not intersect with folded side seam line.",
      "draftBustDartAndSideSeamFront",
    );
  }

  const topSideSeamSegment = {
    from: armscyeEnd,
    to: splitPoint,
  };

  const bottomSideSeamSegment = {
    from: rotateAboutPoint(bustDartOrigin, splitPoint, angleBetweenDartVectors),
    to: rotateAboutPoint(
      bustDartOrigin,
      foldedSideSeamLine.to,
      angleBetweenDartVectors,
    ),
  };

  const topDartLegLine = {
    from: bustDartOrigin,
    to: splitPoint,
  };

  const bottomDartLegLine = {
    from: bustDartOrigin,
    to: rotateAboutPoint(bustDartOrigin, splitPoint, angleBetweenDartVectors),
  };

  return {
    topSideSeamSegment,
    bottomSideSeamSegment,
    topDartLegLine,
    bottomDartLegLine,
  };
};

/**
 * Create dart bulk geometry from leg endpoints and a next-point helper.
 * Reflects rotated lines to compute the intersection that defines bulk extent.
 * Throws if the dart bulk intersection cannot be found.
 */

export const createDartBulk = (
  origin: Point,
  movableDart: Point,
  stationaryDart: Point,
  pointNextMovableDart: Point,
) => {
  // construct dart center line by connecting dart origin to midpoint between dart leg ends
  const originalDartCenterLine = {
    from: origin,
    to: midPoint(movableDart, stationaryDart),
  };

  const { angleBetweenDartVectors } = getDartVectorsAndRelations(
    origin,
    stationaryDart,
    movableDart,
  );

  const rotatedLine = {
    from: rotateAboutPoint(origin, movableDart, -angleBetweenDartVectors),
    to: rotateAboutPoint(
      origin,
      pointNextMovableDart,
      -angleBetweenDartVectors,
    ),
  };

  // reflect line start and end over dartCenterLine to get second dart bulk
  const reflectedLine = {
    from: reflectPointOverLine(rotatedLine.to, originalDartCenterLine),
    to: reflectPointOverLine(rotatedLine.from, originalDartCenterLine),
  };

  // find where dart bulk lines intersect to get where segment should end
  const dartBulkIntersectionPoint = intersection.segmentSegment(
    rotatedLine,
    reflectedLine,
  );

  if (dartBulkIntersectionPoint === null) {
    throw new BodiceError(
      "Invalid bust dart geometry: Please check your measurements.",
      "draftBustDartAndSideSeamFront",
    );
  }

  const stationaryDartBulkLine = {
    from: stationaryDart,
    to: dartBulkIntersectionPoint,
  };
  const movableDartBulkLine = {
    from: movableDart,
    to: dartBulkIntersectionPoint,
  };

  const dartCenterLine = {
    from: origin,
    to: dartBulkIntersectionPoint,
  };

  return {
    dartCenterLine,
    stationaryDartBulkLine,
    movableDartBulkLine,
  };
};

/**
 * Traces the back side seam from the waist up to the armscye.
 *
 * If the waist measurement is larger than the bust measurement
 * (e.g. squarer body types), the side seam is drawn straight from the waist
 * to a projection of the bust point onto the armscye line.
 *
 * Otherwise, the side seam is extended from the waist toward the bust,
 * and its intersection with the armscye line determines the upper
 * endpoint of the seam.
 *
 * @throws If the side seam ray does not intersect the armscye line.
 */
export const traceBackSideSeam = (
  sideBackBust: Point,
  sideBackWaist: Point,
  armscyeLine: Line,
): Line => {
  if (sideBackWaist.x > sideBackBust.x) {
    // for 'squarer' body types, waist line might be larger than bust line
    // if so, bust line measurement should be copied to armscye line and side seam traced from there
    const bustMeasOnArmscyeLine = { x: sideBackBust.x, y: armscyeLine.to.y };

    return { from: sideBackBust, to: bustMeasOnArmscyeLine };
  }

  const armScyeRay = {
    origin: armscyeLine.from,
    direction: vectorFrom(armscyeLine.from, armscyeLine.to),
  };

  const sideSeamRay = {
    origin: sideBackWaist,
    direction: vectorFrom(sideBackWaist, sideBackBust),
  };

  // waist line is smaller than bust line
  const armscyeSideSeamIntersection = intersection.rayRay(
    sideSeamRay,
    armScyeRay,
  );

  if (armscyeSideSeamIntersection === null) {
    throw new BodiceError(
      "Invalid side seam geometry: Could not find intersection between side seam ray and armscye ray.",
      "draftSideSeamBack",
    );
  }

  return { from: sideBackWaist, to: armscyeSideSeamIntersection };
};
