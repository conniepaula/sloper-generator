import type { Point } from "../../drafting/geometry.types";
import type { BodiceMeasurements } from "./bodice.types";

export const ORIGIN: Point = { x: 0, y: 0 };

export const ADDED_ARMSCYE_LENGTH = 0.5;

export const WAIST_DART_DEPTH = 3;

export const MOCK_MEASUREMENTS: BodiceMeasurements = {
  bust: 90,
  waist: 72,
  frontWaistHeight: 41,
  backWaistHeight: 39,
  bustHeight: 25,
  centerFrontHeight: 34,
  centerBackHeight: 37,
  shoulderSlope: 3.5,
  shoulderLength: 12,
  bustSpan: 40,
  frontShoulderSpan: 36,
  backShoulderSpan: 39,
  bustFront: 46,
  frontArmscyeToArmscye: 32,
  backArmscyeToArmscye: 35,
};
