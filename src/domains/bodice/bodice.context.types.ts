import type { CubicBezier, Line, Point } from "../../geometry/geometry.types";
import type { BodiceMeasurements } from "./bodice.types";

type BodicePoints =
  | "centerFrontTop"
  | "centerFrontWaist"
  | "sideFrontWaist"
  | "centerFrontArmscye"
  | "sideFrontArmscye"
  | "centerFrontBust"
  | "sideFrontBust"
  | "sideFrontShoulder"
  | "innerFrontShoulder"
  | "outerFrontShoulder"
  | "centerFrontNeckline"
  | "frontWaistDartApex"
  | "frontWaistDartLeft"
  | "frontWaistDartRight"
  | "bustDartApex"
  | "frontArmholeMidPoint"
  | "frontArmholeDepth"
  | "centerBackTop"
  | "centerBackWaist"
  | "sideBackWaist"
  | "sideBackBust"
  | "sideBackShoulder"
  | "innerBackShoulder"
  | "outerBackShoulder"
  | "centerBackNeckline"
  | "backWaistDartApex"
  | "backWaistDartLeft"
  | "backWaistDartRight"
  | "backArmholeDepth";

type BodiceLines =
  | "centerFront"
  | "frontWaistGuide"
  | "frontArmscyeGuide"
  | "frontBustGuide"
  | "frontShoulderGuide"
  | "frontShoulder"
  | "centerFrontNecklineToWaist"
  | "frontWaistDartLeftLeg"
  | "frontWaistDartRightLeg"
  | "frontWaistDartBulkRight"
  | "frontWaistDartBulkLeft"
  | "frontWaistDartCenter"
  | "armscyeToBustDartSideSeam"
  | "bustDartToWaistSideSeam"
  | "bustDartTopLeg"
  | "bustDartBottomLeg"
  | "bustDartBulkBottom"
  | "bustDartBulkTop"
  | "bustDartCenter"
  | "centerBack"
  | "backWaistGuide"
  | "backBustGuide"
  | "backShoulderGuide"
  | "backShoulder"
  | "centerBackNecklineToWaist"
  | "backWaistDartLeftLeg"
  | "backWaistDartRightLeg"
  | "backWaistDartBulkRight"
  | "backWaistDartBulkLeft"
  | "backWaistDartCenter"
  | "backSideSeam"
  | "backOuterShoulderToArmscyeDepth";

type BodiceCurves =
  | "frontNeckline"
  | "frontShoulderToArmholeDepth"
  | "frontArmholeDepthToSideArmscye"
  | "backNeckline"
  | "backArmholeDepthToArmscye";

export type PointsRecord = Record<BodicePoints, Point>;
export type LinesRecord = Record<BodiceLines, Line>;
export type CurvesRecord = Record<BodiceCurves, CubicBezier>;

export type BodiceDraftContext = {
  measurements: BodiceMeasurements;
  points: PointsRecord;
  lines: LinesRecord;
  curves: CurvesRecord;
};
