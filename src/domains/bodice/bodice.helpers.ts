import {
  angleBetweenVectors,
  intersectionOfLineAndRay,
  normalizeVector,
  rotateAboutPoint,
  vectorFrom,
} from "../../geometry/geometry.helpers";
import type { Line, Point, Ray } from "../../geometry/geometry.types";
import {
  ADDED_ARMSCYE_DEPTH,
  ORIGIN,
  WAIST_DART_DEPTH,
} from "./bodice.constants";

// TODO: Add docs to functions and write unit tests for functions that don't have them yet

export const armscyeLineHeight = (frontWaistHeight: number) =>
  frontWaistHeight / 2 + ADDED_ARMSCYE_DEPTH;

export const waistLineLength = (waist: number) => waist / 4 + WAIST_DART_DEPTH;

export const originToShoulderDistance = (
  frontShoulderSpan: number,
  shoulderLength: number,
  shoulderSlope: number,
) => {
  return (
    frontShoulderSpan / 2 -
    Math.sqrt(Math.pow(shoulderLength, 2) - Math.pow(shoulderSlope, 2))
  );
};

export const bodiceFrontStartingPoints = (frontWaistHeight: number) => {
  const cfNeckline = ORIGIN;
  const cfWaistline: Point = { x: ORIGIN.x, y: ORIGIN.y + frontWaistHeight };

  return {
    cfNeckline,
    cfWaistline,
  };
};

export const bustDartVectorsAndRelations = (
  bustDartOrigin: Point,
  topDartEnd: Point,
  bottomDartEnd: Point,
) => {
  const originalTopDartVector = normalizeVector(
    vectorFrom(bustDartOrigin, topDartEnd),
  );
  const originalBottomDartVector = normalizeVector(
    vectorFrom(bustDartOrigin, bottomDartEnd),
  );
  const angleBetweenDartVectors = angleBetweenVectors(
    originalTopDartVector,
    originalBottomDartVector,
  );

  const foldBoundaryRay: Ray = {
    origin: bustDartOrigin,
    direction: originalTopDartVector,
  };

  return {
    originalTopDartVector,
    originalBottomDartVector,
    angleBetweenDartVectors,
    foldBoundaryRay,
  };
};

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
  const splitPoint = intersectionOfLineAndRay(
    foldedSideSeamLine,
    foldBoundaryRay,
  );

  if (splitPoint === null) {
    throw new Error(
      "Fold boundary ray does not intersect with folded side seam line",
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
