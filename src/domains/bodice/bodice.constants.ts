import type { Point } from "../../geometry/geometry.types";
import type { BodiceMeasurements } from "./bodice.types";

export const ORIGIN = { x: 0, y: 0 } as const satisfies Point;

export const ADDED_ARMSCYE_DEPTH = 0.5;

export const WAIST_DART_DEPTH = 3;

export const BUST_DART_HORIZONTAL_SHIFT = 3; // Usually 3cm for smaller sizes, 4cm for larger

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
  apexToApex: 18,
  frontShoulderSpan: 36,
  backShoulderSpan: 39,
  bustFront: 46,
  frontArmscyeToArmscye: 32,
  backArmscyeToArmscye: 35,
};
