import { expect, test } from "vitest";

import {
  armscyeLineHeight,
  bodiceFrontStartingPoints,
  originToShoulderDistance,
  waistLineLength,
} from "./bodice.helpers";

test("armscyeLineHeight: calculates correct armscye line height based on front waist height", () => {
  const frontWaistHeight = 40;
  const armscyeHeight = armscyeLineHeight(frontWaistHeight);

  // Test assumes ADDED_ARMSCYE_DEPTH is 0.5
  expect(armscyeHeight).toEqual(20.5);
});

test("waistLineLength: calculates correct waist line length based on waist measurement", () => {
  const waist = 60;
  const length = waistLineLength(waist);

  // Test assumes WAIST_DART_DEPTH is 3
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

test("bodiceFrontStartingPoints: returns correct center front neckline and center front waist points", () => {
  const frontWaistHeight = 40;
  const points = bodiceFrontStartingPoints(frontWaistHeight);

  // Test assumes origin is (0, 0)
  expect(points.cfNeckline).toEqual({ x: 0, y: 0 });
  expect(points.cfWaistline).toEqual({
    x: 0,
    y: 40,
  });
});
