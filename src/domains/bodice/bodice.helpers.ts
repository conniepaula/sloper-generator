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
import {
  ADDED_ARMSCYE_DEPTH,
  ORIGIN,
  WAIST_DART_DEPTH,
} from "./bodice.constants";

// TODO: Add docs to functions and write unit tests for functions that don't have them yet

export const bustDartIntake = (
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

export const createDartBulk = (
  origin: Point,
  movableDart: Point,
  stationaryDart: Point,
  pointNextMovableDart: Point,
) => {
  // construct dart center line by connecting dart origin to midpoint between dart leg ends
  const originalDartCenterLine = { from: origin, to: midPoint(movableDart, stationaryDart) };

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
    throw new Error("Dart bulk intersection not found.");
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
    from: origin, to: dartBulkIntersectionPoint
  }

  return {
    dartCenterLine,
    stationaryDartBulkLine,
    movableDartBulkLine,
  };
};
