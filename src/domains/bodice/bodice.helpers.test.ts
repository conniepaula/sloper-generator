import { expect, test } from "vitest";

import {
  armscyeLineHeight,
  originToShoulderDistance,
  waistLineLength,
} from "./bodice.helpers";
import {
  bustDartIntake,
  bodiceStartingPoints,
  getDartVectorsAndRelations,
  foldBustDart,
  unfoldBustDart,
  traceBackSideSeam,
} from "./bodice.helpers";
import { rotateAboutPoint } from "../../geometry/geometry.helpers";

test("armscyeLineHeight: calculates correct armscye line height based on front waist height", () => {
  const frontWaistHeight = 40;
  const armscyeHeight = armscyeLineHeight(frontWaistHeight);

  // Test assumes ADDED_ARMSCYE_DEPTH is 0.5
  expect(armscyeHeight).toEqual(20.5);
});

test("waistLineLength: calculates correct waist line length based on waist measurement", () => {
  const waist = 60;
  const length = waistLineLength(waist);

  // Test assumes FRONT_WAIST_DART_DEPTH is 3
  expect(length).toEqual(18);
});

test("originToShoulderDistance: calculates correct distance from origin to shoulder point based on front shoulder span, shoulder length, and shoulder slope", () => {
  const frontShoulderSpan = 36;
  const shoulderLength = 12;
  const shoulderSlope = 3.5;

  const distance = originToShoulderDistance(
    frontShoulderSpan,
    shoulderLength,
    shoulderSlope,
  );

  expect(distance).toBeCloseTo(6.52, 1);
})


test("bustDartIntake: returns capped value when difference > 5 and actual difference otherwise", () => {
  expect(bustDartIntake(50, 40)).toEqual(5); // difference 10 -> cap 5
  expect(bustDartIntake(45, 43)).toEqual(2); // difference 2 -> return 2
});

test("bodiceStartingPoints: returns neckline at origin and waistline at given height", () => {
  const height = 40;
  const pts = bodiceStartingPoints(height);


  // Test assumes origin is (0, 0)
  expect(pts.neckline).toEqual({ x: 0, y: 0 });
  expect(pts.waistline).toEqual({ x: 0, y: 40 });
});

test("getDartVectorsAndRelations: computes normalized vectors and angle between them", () => {
  const origin = { x: 0, y: 0 };
  const stationary = { x: 1, y: 0 };
  const movable = { x: 0, y: 1 };

  const result = getDartVectorsAndRelations(origin, stationary, movable);

  // normalized vectors should be unit cardinal directions
  expect(result.originalStationaryDartVector).toEqual({ x: 1, y: 0 });
  expect(result.originalMovableDartVector).toEqual({ x: 0, y: 1 });

  // angle between should be approximately pi/2
  expect(result.angleBetweenDartVectors).toBeCloseTo(Math.PI / 2, 6);

  // foldBoundaryRay should originate at dart origin and point along stationary vector
  expect(result.foldBoundaryRay.origin).toEqual(origin);
  expect(result.foldBoundaryRay.direction).toEqual({ x: 1, y: 0 });
});

test("foldBustDart: returns folded side seam line using rotation about bust origin", () => {
  const bustOrigin = { x: 0, y: 0 };
  const angle = Math.PI / 2; // 90deg
  const armScyeEnd = { x: 2, y: 0 };
  const sideWaist = { x: 0, y: 2 };

  const folded = foldBustDart(bustOrigin, angle, armScyeEnd, sideWaist);

  // 'to' point should equal rotating sideWaist about bustOrigin by -angle
  const expectedTo = rotateAboutPoint(bustOrigin, sideWaist, -angle);
  expect(folded.from).toEqual(armScyeEnd);
  expect(folded.to).toEqual(expectedTo);
});

test("unfoldBustDart: unfolds folded side seam into dart legs and side seams", () => {
  const bustOrigin = { x: 0, y: 0 };
  const armscyeEnd = { x: 2, y: 0 };
  const foldedSideSeamLine = { from: { x: 2, y: 0 }, to: { x: 2, y: 2 } };
  const angle = Math.PI / 2;
  const foldBoundaryRay = { origin: bustOrigin, direction: { x: 1, y: 0 } };

  const unfolded = unfoldBustDart(
    foldedSideSeamLine,
    bustOrigin,
    armscyeEnd,
    angle,
    foldBoundaryRay,
  );

  // splitPoint is intersection at (2,0)
  const splitPoint = { x: 2, y: 0 };

  expect(unfolded.topSideSeamSegment).toEqual({ from: armscyeEnd, to: splitPoint });
  expect(unfolded.topDartLegLine).toEqual({ from: bustOrigin, to: splitPoint });

  // bottom leg is rotation of splitPoint by angle about bustOrigin -> (0,2)
  expect(unfolded.bottomDartLegLine.to).toEqual(rotateAboutPoint(bustOrigin, splitPoint, angle));
});

test("traceBackSideSeam: when waist > bust, bust measurement is projected on armscye line and connected to waist to form side seam", () => {
  const backBust = { x: 4, y: 10 };
  const backWaist = { x: 6, y: 20 };
  const armscyeLine = { from: { x: 0, y: 5 }, to: { x: 10, y: 5 } };

  const line = traceBackSideSeam(backBust, backWaist, armscyeLine);

  expect(line).toEqual({ from: backBust, to: { x: backBust.x, y: armscyeLine.to.y } });
});

test("traceBackSideSeam: when waist < bust, side seam starts and waist and ends when it intersects with armscye line, passing through bust point", () => {
  const backBust = { x: 2, y: 10 };
  const backWaist = { x: 0, y: 20 };
  const armscyeLine = { from: { x: 0, y: 5 }, to: { x: 10, y: 5 } };

  const line = traceBackSideSeam(backBust, backWaist, armscyeLine);

  expect(line.from).toEqual(backWaist);
  expect(line.to).toEqual({ x: 3, y: 5 });
});
