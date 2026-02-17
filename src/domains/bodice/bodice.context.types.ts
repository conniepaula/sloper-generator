import type { DraftContextBase } from "../draft/draft.context.types";
import type { BodiceMeasurements } from "./bodice.types";

type BodicePoints =
  | "front_centerTop"
  | "front_centerWaist"
  | "front_sideWaist"
  | "front_centerArmscye"
  | "front_sideArmscye"
  | "front_centerBust"
  | "front_sideBust"
  | "front_sideShoulder"
  | "front_innerShoulder"
  | "front_outerShoulder"
  | "front_centerNeckline"
  | "front_waistDartApex"
  | "front_waistDartLeft"
  | "front_waistDartRight"
  | "front_bustDartApex"
  | "front_armholeMidPoint"
  | "front_armholeDepth"
  | "back_centerBackTop"
  | "back_centerBackWaist"
  | "back_sideWaist"
  | "back_sideBust"
  | "back_sideShoulder"
  | "back_innerShoulder"
  | "back_outerShoulder"
  | "back_centerBackNeckline"
  | "back_waistDartApex"
  | "back_waistDartLeft"
  | "back_waistDartRight"
  | "back_armholeDepth";

type BodiceLines =
  | "front_centerFront"
  | "front_waistGuide"
  | "front_armscyeGuide"
  | "front_bustGuide"
  | "front_shoulderGuide"
  | "front_shoulder"
  | "front_centerNecklineToWaist"
  | "front_waistDartLeftLeg"
  | "front_waistDartRightLeg"
  | "front_waistDartBulkRight"
  | "front_waistDartBulkLeft"
  | "front_waistDartCenter"
  | "front_armscyeToBustDartSideSeam"
  | "front_bustDartToWaistSideSeam"
  | "front_bustDartTopLeg"
  | "front_bustDartBottomLeg"
  | "front_bustDartBulkBottom"
  | "front_bustDartBulkTop"
  | "front_bustDartCenter"
  | "back_centerBack"
  | "back_waistGuide"
  | "back_bustGuide"
  | "back_shoulderGuide"
  | "back_shoulder"
  | "back_centerNecklineToWaist"
  | "back_waistDartLeftLeg"
  | "back_waistDartRightLeg"
  | "back_waistDartBulkRight"
  | "back_waistDartBulkLeft"
  | "back_waistDartCenter"
  | "back_sideSeam"
  | "back_outerShoulderToArmscyeDepth";

type BodiceCurves =
  | "front_neckline"
  | "front_shoulderToArmholeDepth"
  | "front_armholeDepthToSideArmscye"
  | "back_neckline"
  | "back_armholeDepthToArmscye";

export type BodiceDraftContext = DraftContextBase<
  BodiceMeasurements,
  BodicePoints,
  BodiceLines,
  BodiceCurves
>;

export type PointsRecord = BodiceDraftContext["points"];
export type LinesRecord = BodiceDraftContext["lines"];
export type CurvesRecord = BodiceDraftContext["curves"];
