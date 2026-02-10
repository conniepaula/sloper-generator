import type { Point } from "../../geometry/geometry.types";
import {
  ADDED_ARMSCYE_DEPTH,
  ORIGIN,
  WAIST_DART_DEPTH,
} from "./bodice.constants";


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

export const frontWaistLinePoints = (frontWaistHeight: number) => {
  const cfNeckline = ORIGIN;
  const cfWaistline: Point = { x: ORIGIN.x, y: ORIGIN.y + frontWaistHeight };

  return {
    cfNeckline,
    cfWaistline,
  };
};
