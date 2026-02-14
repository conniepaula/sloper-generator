import {
  orthogonallyProjectPointOntoLine,
  translatePoint,
  curvePoints,
  midPoint,
} from "../../geometry/geometry.helpers";
import { AxisEnumMap } from "../../geometry/geometry.types";

import type { BodiceDraftContext } from "./bodice.context.types";
import {
  BACK_WAIST_DART_DEPTH,
  BUST_DART_HORIZONTAL_SHIFT,
  FRONT_WAIST_DART_DEPTH,
} from "./bodice.constants";
import {
  armscyeLineHeight,
  calculateBustDartIntake,
  createBaseCenterPoints,
  createDartBulk,
  foldBustDart,
  getDartVectorsAndRelations,
  originToShoulderDistance,
  traceBackSideSeam,
  unfoldBustDart,
  waistLineLength,
} from "./bodice.helpers";

// DRAFTING STEPS - FRONT BODICE

export const draftBaseFront = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines } = ctx;

  const base = createBaseCenterPoints(m.frontWaistHeight);

  points.centerFrontTop = base.centerTop;
  points.centerFrontWaist = base.centerBottom;
  points.sideFrontWaist = translatePoint(
    points.centerFrontWaist,
    waistLineLength(m.waist, FRONT_WAIST_DART_DEPTH),
  );

  lines.centerFront = {
    from: points.centerFrontTop,
    to: points.centerFrontWaist,
  };

  lines.frontWaistGuide = {
    from: points.centerFrontWaist,
    to: points.sideFrontWaist,
  };
};

export const draftHelpersFront = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines } = ctx;

  // Armscye points
  const armscyeHeight = armscyeLineHeight(m.frontWaistHeight);

  points.centerFrontArmscye = translatePoint(
    points.centerFrontTop,
    0,
    armscyeHeight,
  );
  points.sideFrontArmscye = translatePoint(
    points.centerFrontArmscye,
    m.bustFront / 2,
  );

  // Bust points
  points.centerFrontBust = translatePoint(
    points.centerFrontTop,
    0,
    m.bustHeight,
  );
  points.sideFrontBust = translatePoint(
    points.centerFrontBust,
    m.bustFront / 2,
  );

  // Shoulder width point
  points.sideFrontShoulder = translatePoint(
    points.centerFrontTop,
    m.frontShoulderSpan / 2,
  );

  // Armscye guide line
  lines.frontArmscyeGuide = {
    from: points.centerFrontArmscye,
    to: points.sideFrontArmscye,
  };

  // Bust guide line
  lines.frontBustGuide = {
    from: points.centerFrontBust,
    to: points.sideFrontBust,
  };

  // Shoulder guide line
  lines.frontShoulderGuide = {
    from: points.centerFrontTop,
    to: points.sideFrontShoulder,
  };
};

export const draftShoulderFront = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines } = ctx;

  // Shoulder points
  points.innerFrontShoulder = translatePoint(
    points.centerFrontTop,
    originToShoulderDistance(
      m.frontShoulderSpan,
      m.shoulderLength,
      m.shoulderSlope,
    ),
  );

  points.outerFrontShoulder = translatePoint(
    points.sideFrontShoulder,
    0,
    m.shoulderSlope,
  );

  // Shoulder line

  lines.frontShoulder = {
    from: points.innerFrontShoulder,
    to: points.outerFrontShoulder,
  };
};

export const draftNecklineFront = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines, curves } = ctx;

  const necklineHeight = m.frontWaistHeight - m.centerFrontHeight;

  // Neckline point
  points.centerFrontNeckline = translatePoint(
    points.centerFrontTop,
    0,
    necklineHeight,
  );

  // Neckline curve
  curves.frontNeckline = curvePoints(
    points.centerFrontNeckline,
    points.innerFrontShoulder,
  );

  // Center front neck to waist line
  lines.centerFrontNecklineToWaist = {
    from: points.centerFrontNeckline,
    to: points.centerFrontWaist,
  };
};

export const draftWaistFront = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines } = ctx;

  const halfBustApex = m.apexToApex / 2;

  points.frontWaistDartApex = { x: halfBustApex, y: m.bustHeight };

  const waistDartApexProjectionOnWaist = orthogonallyProjectPointOntoLine(
    points.frontWaistDartApex,
    lines.frontWaistGuide,
  );

  const halfWaistDartDepth = FRONT_WAIST_DART_DEPTH / 2;

  points.frontWaistDartLeft = translatePoint(
    waistDartApexProjectionOnWaist,
    halfWaistDartDepth,
  );
  points.frontWaistDartRight = translatePoint(
    waistDartApexProjectionOnWaist,
    -halfWaistDartDepth,
  );

  // Dart leg lines

  lines.frontWaistDartLeftLeg = {
    from: points.frontWaistDartApex,
    to: points.frontWaistDartLeft,
  };
  lines.frontWaistDartRightLeg = {
    from: points.frontWaistDartApex,
    to: points.frontWaistDartRight,
  };

  // Drafting dart bulk

  const { movableDartBulkLine, stationaryDartBulkLine, dartCenterLine } =
    createDartBulk(
      points.frontWaistDartApex,
      points.frontWaistDartRight,
      points.frontWaistDartLeft,
      points.centerFrontWaist,
    );

  lines.frontWaistDartBulkRight = movableDartBulkLine;
  lines.frontWaistDartBulkLeft = stationaryDartBulkLine;
  lines.frontWaistDartCenter = dartCenterLine;
};

export const draftBustDartAndSideSeamFront = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines } = ctx;

  points.bustDartApex = translatePoint(
    points.frontWaistDartApex,
    BUST_DART_HORIZONTAL_SHIFT,
  );

  const halfBustDartIntake =
    calculateBustDartIntake(m.frontWaistHeight, m.backWaistHeight) / 2;

  const tempBustDartTop = translatePoint(
    points.sideFrontBust,
    0,
    -halfBustDartIntake,
  );
  const tempBustDartBottom = translatePoint(
    points.sideFrontBust,
    0,
    halfBustDartIntake,
  );

  // Mimicking fold to construct side seam
  const { foldBoundaryRay, angleBetweenDartVectors } =
    getDartVectorsAndRelations(
      points.bustDartApex,
      tempBustDartTop,
      tempBustDartBottom,
    );

  const foldedSideSeam = foldBustDart(
    points.bustDartApex,
    angleBetweenDartVectors,
    points.sideFrontArmscye,
    points.sideFrontWaist,
  );

  // Mimicking unfolding
  const {
    bottomDartLegLine,
    topDartLegLine,
    topSideSeamSegment,
    bottomSideSeamSegment,
  } = unfoldBustDart(
    foldedSideSeam,
    points.bustDartApex,
    points.sideFrontArmscye,
    angleBetweenDartVectors,
    foldBoundaryRay,
  );

  lines.armscyeToBustDartSideSeam = topSideSeamSegment;
  lines.bustDartToWaistSideSeam = bottomSideSeamSegment;
  lines.bustDartTopLeg = topDartLegLine;
  lines.bustDartBottomLeg = bottomDartLegLine;

  // Drafting bust dart bulk
  const { movableDartBulkLine, stationaryDartBulkLine, dartCenterLine } =
    createDartBulk(
      points.bustDartApex,
      lines.bustDartBottomLeg.to,
      lines.bustDartTopLeg.to,
      points.sideFrontWaist,
    );

  lines.bustDartBulkBottom = movableDartBulkLine;
  lines.bustDartBulkTop = stationaryDartBulkLine;
  lines.bustDartCenter = dartCenterLine;
};

export const draftArmholeFront = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines, curves } = ctx;

  const outerShoulderProjectionOnArmscye = orthogonallyProjectPointOntoLine(
    points.outerFrontShoulder,
    lines.frontArmscyeGuide,
  );

  // armhole points

  points.frontArmholeMidPoint = midPoint(
    points.outerFrontShoulder,
    outerShoulderProjectionOnArmscye,
  );

  points.frontArmholeDepth = translatePoint(
    points.frontArmholeMidPoint,
    m.frontArmscyeToArmscye / 2 - m.frontShoulderSpan / 2,
  );

  // armhole curves
  curves.frontShoulderToArmholeDepth = curvePoints(
    points.outerFrontShoulder,
    points.frontArmholeDepth,
    { axis: AxisEnumMap.HORIZONTAL, tension: 0.05 },
  );

  curves.frontArmholeDepthToSideArmscye = curvePoints(
    points.frontArmholeDepth,
    points.sideFrontArmscye,
    { axis: AxisEnumMap.VERTICAL, tension: 0.8 },
    { axis: AxisEnumMap.HORIZONTAL, tension: 0.3 },
  );
};

// DRAFTING STEPS - BACK BODICE

export const draftBaseBack = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines } = ctx;

  const base = createBaseCenterPoints(m.backWaistHeight);

  points.centerBackTop = base.centerTop;
  points.centerBackWaist = base.centerBottom;
  points.sideBackWaist = translatePoint(
    points.centerBackWaist,
    waistLineLength(m.waist, BACK_WAIST_DART_DEPTH),
  );

  lines.centerBack = {
    from: points.centerBackTop,
    to: points.centerBackWaist,
  };

  lines.backWaistGuide = {
    from: points.centerBackWaist,
    to: points.sideBackWaist,
  };
};

export const draftHelpersBack = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines } = ctx;

  // Bust point
  // Bust line height is the same as in front bodice
  const halfBustBack = (m.bust - m.bustFront) / 2;
  points.sideBackBust = translatePoint(points.centerFrontBust, halfBustBack);

  // Shoulder width point
  points.sideBackShoulder = translatePoint(
    points.centerBackTop,
    m.backShoulderSpan / 2,
  );

  // Bust guide line
  lines.backBustGuide = {
    from: points.centerFrontBust,
    to: points.sideBackBust,
  };

  // Shoulder guide line
  lines.backShoulderGuide = {
    from: points.centerBackTop,
    to: points.sideBackShoulder,
  };
};

export const draftShoulderBack = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines } = ctx;

  const halfShoulderSlope = m.shoulderSlope / 2;

  // shoulder construction points
  points.innerBackShoulder = translatePoint(
    points.centerBackTop,
    originToShoulderDistance(
      m.backShoulderSpan,
      m.shoulderLength,
      m.shoulderSlope,
    ),
    -halfShoulderSlope,
  );

  points.outerBackShoulder = translatePoint(
    points.sideBackShoulder,
    0,
    halfShoulderSlope,
  );

  // shoulder line
  lines.backShoulder = {
    from: points.innerBackShoulder,
    to: points.outerBackShoulder,
  };
};

export const draftNecklineBack = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines, curves } = ctx;

  const necklineHeight = m.backWaistHeight - m.centerBackHeight;

  // neckline point
  points.centerBackNeckline = translatePoint(
    points.centerBackTop,
    0,
    necklineHeight,
  );

  // neckline curve
  curves.backNeckline = curvePoints(
    points.centerBackNeckline,
    points.innerBackShoulder,
  );

  // center back neckline to waist
  lines.centerBackNecklineToWaist = {
    from: points.centerBackNeckline,
    to: points.centerBackWaist,
  };
};

export const draftWaistBack = (ctx: BodiceDraftContext) => {
  const { points, lines } = ctx;

  const waistHalfwayPoint = midPoint(
    points.centerBackWaist,
    points.sideBackWaist,
  );

  points.backWaistDartApex = orthogonallyProjectPointOntoLine(
    waistHalfwayPoint,
    lines.frontBustGuide,
  );

  const halfWaistDartDepth = BACK_WAIST_DART_DEPTH / 2;

  points.backWaistDartLeft = translatePoint(
    waistHalfwayPoint,
    halfWaistDartDepth,
  );
  points.backWaistDartRight = translatePoint(
    waistHalfwayPoint,
    -halfWaistDartDepth,
  );

  // Dart leg lines

  lines.backWaistDartLeftLeg = {
    from: points.backWaistDartApex,
    to: points.backWaistDartLeft,
  };
  lines.backWaistDartRightLeg = {
    from: points.backWaistDartApex,
    to: points.backWaistDartRight,
  };

  // Drafting dart bulk

  const { movableDartBulkLine, stationaryDartBulkLine, dartCenterLine } =
    createDartBulk(
      points.backWaistDartApex,
      points.backWaistDartRight,
      points.backWaistDartLeft,
      points.centerBackWaist,
    );

  lines.backWaistDartBulkRight = movableDartBulkLine;
  lines.backWaistDartBulkLeft = stationaryDartBulkLine;
  lines.backWaistDartCenter = dartCenterLine;
};

export const draftSideSeamBack = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines, curves } = ctx;

  // front armscye guide line also serves as a guide line for back
  lines.backSideSeam = traceBackSideSeam(
    points.sideBackBust,
    points.sideBackWaist,
    lines.frontArmscyeGuide,
  );
};

export const draftArmholeBack = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines, curves } = ctx;

  const outerShoulderProjectedOnArmscye = orthogonallyProjectPointOntoLine(
    points.outerBackShoulder,
    lines.frontArmscyeGuide,
  );

  const armscyeMidPoint = midPoint(
    points.outerBackShoulder,
    outerShoulderProjectedOnArmscye,
  );

  // armhole depth point
  points.backArmholeDepth = translatePoint(
    armscyeMidPoint,
    (m.backArmscyeToArmscye - m.backShoulderSpan) / 2,
  );

  // armhole line from outer shoulder to armhole depth
  lines.backOuterShoulderToArmscyeDepth = {
    from: points.outerBackShoulder,
    to: points.backArmholeDepth,
  };

  // armhole curve from armhole depth to side armscye
  // TODO: Improve curves!
  curves.backArmholeDepthToArmscye = curvePoints(
    points.backArmholeDepth,
    lines.backSideSeam.to,
    { axis: AxisEnumMap.VERTICAL, tension: 0.8 },
    { axis: AxisEnumMap.HORIZONTAL, tension: 0.4 },
  );
};
