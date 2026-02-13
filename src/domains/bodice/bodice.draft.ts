import {
  armscyeLineHeight as armscyeLineHeightFunc,
  bustDartIntake as bustDartIntakeFunc,
  getDartVectorsAndRelations,
  foldBustDart,
  bodiceFrontStartingPoints,
  unfoldBustDart,
  waistLineLength,
  createDartBulk,
} from "./bodice.helpers";
import type {
  BasePoints,
  PrimaryPoints,
  QuaternaryPoints,
  SecondaryPoints,
  TertiaryPoints,
} from "./bodice.types";
import {
  BUST_DART_HORIZONTAL_SHIFT,
  MOCK_MEASUREMENTS as m,
  WAIST_DART_DEPTH,
} from "./bodice.constants";
import {
  curvePoints,
  midPoint,
  translatePoint,
} from "../../geometry/geometry.helpers";
import { originToShoulderDistance } from "./bodice.helpers";
import { AxisEnumMap, type Ray } from "../../geometry/geometry.types";

const bustDartIntake = bustDartIntakeFunc(
  m.frontWaistHeight,
  m.backWaistHeight,
);
const armscyeLineHeight = armscyeLineHeightFunc(m.frontWaistHeight);

export const basePoints: BasePoints = {
  ...bodiceFrontStartingPoints(m.frontWaistHeight),
};

const primaryPoints: PrimaryPoints = {
  cfArmscye: translatePoint(basePoints.cfNeckline, 0, armscyeLineHeight),
  cfBust: translatePoint(basePoints.cfNeckline, 0, m.bustHeight),
  lShoulder: translatePoint(basePoints.cfNeckline, m.frontShoulderSpan / 2),
  sWaist: translatePoint(basePoints.cfWaistline, waistLineLength(m.waist)),
  necklineStart: translatePoint(
    basePoints.cfNeckline,
    0,
    m.frontWaistHeight - m.centerFrontHeight,
  ),
  shoulderStart: translatePoint(
    basePoints.cfNeckline,
    originToShoulderDistance(
      m.frontShoulderSpan,
      m.shoulderLength,
      m.shoulderSlope,
    ),
  ),
  waistDartCenter: translatePoint(basePoints.cfWaistline, m.apexToApex / 2),
};

const secondaryPoints: SecondaryPoints = {
  armscyeStart: translatePoint(primaryPoints.lShoulder, 0, armscyeLineHeight),
  lShoulderSlope: translatePoint(primaryPoints.lShoulder, 0, m.shoulderSlope),
  sArmscye: translatePoint(primaryPoints.cfArmscye, m.bustFront / 2),
  sBust: translatePoint(primaryPoints.cfBust, m.bustFront / 2),
  waistDartOrigin: translatePoint(primaryPoints.cfBust, m.apexToApex / 2),
  lWaistDart: translatePoint(
    primaryPoints.waistDartCenter,
    WAIST_DART_DEPTH / 2,
  ),
  rWaistDart: translatePoint(
    primaryPoints.waistDartCenter,
    -WAIST_DART_DEPTH / 2,
  ),
};

const tertiaryPoints: TertiaryPoints = {
  armholeMidPoint: midPoint(
    secondaryPoints.lShoulderSlope,
    secondaryPoints.armscyeStart,
  ),
  tBustDart: translatePoint(secondaryPoints.sBust, 0, -bustDartIntake / 2),
  bBustDart: translatePoint(secondaryPoints.sBust, 0, bustDartIntake / 2),
  bustDartOrigin: translatePoint(
    secondaryPoints.waistDartOrigin,
    BUST_DART_HORIZONTAL_SHIFT,
  ),
};

const quaternaryPoints: QuaternaryPoints = {
  armholeDepth: translatePoint(
    tertiaryPoints.armholeMidPoint,
    m.frontArmscyeToArmscye / 2 - m.frontShoulderSpan / 2,
  ),
};

export const points = {
  ...basePoints,
  ...primaryPoints,
  ...secondaryPoints,
  ...tertiaryPoints,
  ...quaternaryPoints,
};

export const centerFrontLine = {
  from: points.necklineStart, // to test, change to cfNeckline
  to: points.cfWaistline,
};

export const armScyeLine = {
  from: points.cfArmscye,
  to: points.sArmscye,
};

export const bustLine = {
  from: points.cfBust,
  to: points.bustDartOrigin,
};

export const shoulderLine = {
  from: points.lShoulder,
  to: points.cfNeckline,
};

export const waistLine = {
  from: points.cfWaistline,
  to: points.sWaist,
};

export const lWaistLine = {
  from: points.lWaistDart,
  to: points.sWaist,
};
export const rWaistLine = {
  from: points.cfWaistline,
  to: points.rWaistDart,
};

export const armScyeVerticalLine = {
  from: points.lShoulder,
  to: points.armscyeStart,
};

export const shoulderSlopeLine = {
  from: points.shoulderStart,
  to: points.lShoulderSlope,
};

export const rWaistDartLine = {
  from: points.waistDartOrigin,
  to: points.rWaistDart,
};

export const lWaistDartLine = {
  from: points.waistDartOrigin,
  to: points.lWaistDart,
};

/// BUST DART AND SIDE SEAM CONSTRUCTION

const { foldBoundaryRay, angleBetweenDartVectors } = getDartVectorsAndRelations(
  points.bustDartOrigin,
  points.tBustDart,
  points.bBustDart,
);

const foldedSideSeam = foldBustDart(
  points.bustDartOrigin,
  angleBetweenDartVectors,
  points.sArmscye,
  points.sWaist,
);

export const {
  bottomDartLegLine,
  topDartLegLine,
  topSideSeamSegment,
  bottomSideSeamSegment,
} = unfoldBustDart(
  foldedSideSeam,
  points.bustDartOrigin,
  points.sArmscye,
  angleBetweenDartVectors,
  foldBoundaryRay,
);

// DRAFTING CURVES

export const necklineCPoints = curvePoints(
  points.necklineStart,
  points.shoulderStart,
);
const shoulderToArmholeDepthCPoints = curvePoints(
  points.lShoulderSlope,
  points.armholeDepth,
  { axis: AxisEnumMap.HORIZONTAL, tension: 0.05 },
);

const armholeDepthToArmscyeCPoints = curvePoints(
  points.armholeDepth,
  points.sArmscye,
  { axis: AxisEnumMap.VERTICAL, tension: 0.8 },
  { axis: AxisEnumMap.HORIZONTAL, tension: 0.3 },
);

export const armholeCurves = [
  shoulderToArmholeDepthCPoints,
  armholeDepthToArmscyeCPoints,
];

///////////

export const { movableDartBulkLine, stationaryDartBulkLine, dartCenterLine } =
  createDartBulk(
    points.waistDartOrigin,
    points.rWaistDart,
    points.lWaistDart,
    points.cfWaistline,
  );
export const {
  movableDartBulkLine: bustDartBulk1,
  stationaryDartBulkLine: bustDartBulk2,
  dartCenterLine: bustDartCenterLine,
} = createDartBulk(
  points.bustDartOrigin,
  bottomDartLegLine.to,
  topDartLegLine.to,
  points.sWaist,
);
