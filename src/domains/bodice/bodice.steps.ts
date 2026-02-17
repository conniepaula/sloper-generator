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

  points.front_centerTop = base.centerTop;
  points.front_centerWaist = base.centerBottom;
  points.front_sideWaist = translatePoint(
    points.front_centerWaist,
    waistLineLength(m.waist, FRONT_WAIST_DART_DEPTH),
  );

  lines.front_centerFront = {
    from: points.front_centerTop,
    to: points.front_centerWaist,
  };

  lines.front_waistGuide = {
    from: points.front_centerWaist,
    to: points.front_sideWaist,
  };
};

export const draftHelpersFront = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines } = ctx;

  // Armscye points
  const armscyeHeight = armscyeLineHeight(m.frontWaistHeight);

  points.front_centerArmscye = translatePoint(
    points.front_centerTop,
    0,
    armscyeHeight,
  );
  points.front_sideArmscye = translatePoint(
    points.front_centerArmscye,
    m.bustFront / 2,
  );

  // Bust points
  points.front_centerBust = translatePoint(
    points.front_centerTop,
    0,
    m.bustHeight,
  );
  points.front_sideBust = translatePoint(
    points.front_centerBust,
    m.bustFront / 2,
  );

  // Shoulder width point
  points.front_sideShoulder = translatePoint(
    points.front_centerTop,
    m.frontShoulderSpan / 2,
  );

  // Armscye guide line
  lines.front_armscyeGuide = {
    from: points.front_centerArmscye,
    to: points.front_sideArmscye,
  };

  // Bust guide line
  lines.front_bustGuide = {
    from: points.front_centerBust,
    to: points.front_sideBust,
  };

  // Shoulder guide line
  lines.front_shoulderGuide = {
    from: points.front_centerTop,
    to: points.front_sideShoulder,
  };
};

export const draftShoulderFront = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines } = ctx;

  // Shoulder points
  points.front_innerShoulder = translatePoint(
    points.front_centerTop,
    originToShoulderDistance(
      m.frontShoulderSpan,
      m.shoulderLength,
      m.shoulderSlope,
    ),
  );

  points.front_outerShoulder = translatePoint(
    points.front_sideShoulder,
    0,
    m.shoulderSlope,
  );

  // Shoulder line

  lines.front_shoulder = {
    from: points.front_innerShoulder,
    to: points.front_outerShoulder,
  };
};

export const draftNecklineFront = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines, curves } = ctx;

  const necklineHeight = m.frontWaistHeight - m.centerFrontHeight;

  // Neckline point
  points.front_centerNeckline = translatePoint(
    points.front_centerTop,
    0,
    necklineHeight,
  );

  // Neckline curve
  curves.front_neckline = curvePoints(
    points.front_centerNeckline,
    points.front_innerShoulder,
  );

  // Center front neck to waist line
  lines.front_centerNecklineToWaist = {
    from: points.front_centerNeckline,
    to: points.front_centerWaist,
  };
};

export const draftWaistFront = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines } = ctx;

  const halfBustApex = m.apexToApex / 2;

  points.front_waistDartApex = { x: halfBustApex, y: m.bustHeight };

  const waistDartApexProjectionOnWaist = orthogonallyProjectPointOntoLine(
    points.front_waistDartApex,
    lines.front_waistGuide,
  );

  const halfWaistDartDepth = FRONT_WAIST_DART_DEPTH / 2;

  points.front_waistDartLeft = translatePoint(
    waistDartApexProjectionOnWaist,
    halfWaistDartDepth,
  );
  points.front_waistDartRight = translatePoint(
    waistDartApexProjectionOnWaist,
    -halfWaistDartDepth,
  );

  // Dart leg lines

  lines.front_waistDartLeftLeg = {
    from: points.front_waistDartApex,
    to: points.front_waistDartLeft,
  };
  lines.front_waistDartRightLeg = {
    from: points.front_waistDartApex,
    to: points.front_waistDartRight,
  };

  // Drafting dart bulk

  const { movableDartBulkLine, stationaryDartBulkLine, dartCenterLine } =
    createDartBulk(
      points.front_waistDartApex,
      points.front_waistDartRight,
      points.front_waistDartLeft,
      points.front_centerWaist,
    );

  lines.front_waistDartBulkRight = movableDartBulkLine;
  lines.front_waistDartBulkLeft = stationaryDartBulkLine;
  lines.front_waistDartCenter = dartCenterLine;
};

export const draftBustDartAndSideSeamFront = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines } = ctx;

  points.front_bustDartApex = translatePoint(
    points.front_waistDartApex,
    BUST_DART_HORIZONTAL_SHIFT,
  );

  const halfBustDartIntake =
    calculateBustDartIntake(m.frontWaistHeight, m.backWaistHeight) / 2;

  const tempBustDartTop = translatePoint(
    points.front_sideBust,
    0,
    -halfBustDartIntake,
  );
  const tempBustDartBottom = translatePoint(
    points.front_sideBust,
    0,
    halfBustDartIntake,
  );

  // Mimicking fold to construct side seam
  const { foldBoundaryRay, angleBetweenDartVectors } =
    getDartVectorsAndRelations(
      points.front_bustDartApex,
      tempBustDartTop,
      tempBustDartBottom,
    );

  const foldedSideSeam = foldBustDart(
    points.front_bustDartApex,
    angleBetweenDartVectors,
    points.front_sideArmscye,
    points.front_sideWaist,
  );

  // Mimicking unfolding
  const {
    bottomDartLegLine,
    topDartLegLine,
    topSideSeamSegment,
    bottomSideSeamSegment,
  } = unfoldBustDart(
    foldedSideSeam,
    points.front_bustDartApex,
    points.front_sideArmscye,
    angleBetweenDartVectors,
    foldBoundaryRay,
  );

  lines.front_armscyeToBustDartSideSeam = topSideSeamSegment;
  lines.front_bustDartToWaistSideSeam = bottomSideSeamSegment;
  lines.front_bustDartTopLeg = topDartLegLine;
  lines.front_bustDartBottomLeg = bottomDartLegLine;

  // Drafting bust dart bulk
  const { movableDartBulkLine, stationaryDartBulkLine, dartCenterLine } =
    createDartBulk(
      points.front_bustDartApex,
      lines.front_bustDartBottomLeg.to,
      lines.front_bustDartTopLeg.to,
      points.front_sideWaist,
    );

  lines.front_bustDartBulkBottom = movableDartBulkLine;
  lines.front_bustDartBulkTop = stationaryDartBulkLine;
  lines.front_bustDartCenter = dartCenterLine;
};

export const draftArmholeFront = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines, curves } = ctx;

  const outerShoulderProjectionOnArmscye = orthogonallyProjectPointOntoLine(
    points.front_outerShoulder,
    lines.front_armscyeGuide,
  );

  // armhole points

  points.front_armholeMidPoint = midPoint(
    points.front_outerShoulder,
    outerShoulderProjectionOnArmscye,
  );

  points.front_armholeDepth = translatePoint(
    points.front_armholeMidPoint,
    m.frontArmscyeToArmscye / 2 - m.frontShoulderSpan / 2,
  );

  // armhole curves
  curves.front_shoulderToArmholeDepth = curvePoints(
    points.front_outerShoulder,
    points.front_armholeDepth,
    { axis: AxisEnumMap.HORIZONTAL, tension: 0.05 },
  );

  curves.front_armholeDepthToSideArmscye = curvePoints(
    points.front_armholeDepth,
    points.front_sideArmscye,
    { axis: AxisEnumMap.VERTICAL, tension: 0.8 },
    { axis: AxisEnumMap.HORIZONTAL, tension: 0.3 },
  );
};

// DRAFTING STEPS - BACK BODICE

export const draftBaseBack = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines } = ctx;

  const base = createBaseCenterPoints(m.backWaistHeight);

  points.back_centerBackTop = base.centerTop;
  points.back_centerBackWaist = base.centerBottom;
  points.back_sideWaist = translatePoint(
    points.back_centerBackWaist,
    waistLineLength(m.waist, BACK_WAIST_DART_DEPTH),
  );

  lines.back_centerBack = {
    from: points.back_centerBackTop,
    to: points.back_centerBackWaist,
  };

  lines.back_waistGuide = {
    from: points.back_centerBackWaist,
    to: points.back_sideWaist,
  };
};

export const draftHelpersBack = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines } = ctx;

  // Bust point
  // Bust line height is the same as in front bodice
  const halfBustBack = (m.bust - m.bustFront) / 2;
  points.back_sideBust = translatePoint(points.front_centerBust, halfBustBack);

  // Shoulder width point
  points.back_sideShoulder = translatePoint(
    points.back_centerBackTop,
    m.backShoulderSpan / 2,
  );

  // Bust guide line
  lines.back_bustGuide = {
    from: points.front_centerBust,
    to: points.back_sideBust,
  };

  // Shoulder guide line
  lines.back_shoulderGuide = {
    from: points.back_centerBackTop,
    to: points.back_sideShoulder,
  };
};

export const draftShoulderBack = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines } = ctx;

  const halfShoulderSlope = m.shoulderSlope / 2;

  // shoulder construction points
  points.back_innerShoulder = translatePoint(
    points.back_centerBackTop,
    originToShoulderDistance(
      m.backShoulderSpan,
      m.shoulderLength,
      m.shoulderSlope,
    ),
    -halfShoulderSlope,
  );

  points.back_outerShoulder = translatePoint(
    points.back_sideShoulder,
    0,
    halfShoulderSlope,
  );

  // shoulder line
  lines.back_shoulder = {
    from: points.back_innerShoulder,
    to: points.back_outerShoulder,
  };
};

export const draftNecklineBack = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines, curves } = ctx;

  const necklineHeight = m.backWaistHeight - m.centerBackHeight;

  // neckline point
  points.back_centerBackNeckline = translatePoint(
    points.back_centerBackTop,
    0,
    necklineHeight,
  );

  // neckline curve
  curves.back_neckline = curvePoints(
    points.back_centerBackNeckline,
    points.back_innerShoulder,
  );

  // center back neckline to waist
  lines.back_centerNecklineToWaist = {
    from: points.back_centerBackNeckline,
    to: points.back_centerBackWaist,
  };
};

export const draftWaistBack = (ctx: BodiceDraftContext) => {
  const { points, lines } = ctx;

  const waistHalfwayPoint = midPoint(
    points.back_centerBackWaist,
    points.back_sideWaist,
  );

  points.back_waistDartApex = orthogonallyProjectPointOntoLine(
    waistHalfwayPoint,
    lines.front_bustGuide,
  );

  const halfWaistDartDepth = BACK_WAIST_DART_DEPTH / 2;

  points.back_waistDartLeft = translatePoint(
    waistHalfwayPoint,
    halfWaistDartDepth,
  );
  points.back_waistDartRight = translatePoint(
    waistHalfwayPoint,
    -halfWaistDartDepth,
  );

  // Dart leg lines

  lines.back_waistDartLeftLeg = {
    from: points.back_waistDartApex,
    to: points.back_waistDartLeft,
  };
  lines.back_waistDartRightLeg = {
    from: points.back_waistDartApex,
    to: points.back_waistDartRight,
  };

  // Drafting dart bulk

  const { movableDartBulkLine, stationaryDartBulkLine, dartCenterLine } =
    createDartBulk(
      points.back_waistDartApex,
      points.back_waistDartRight,
      points.back_waistDartLeft,
      points.back_centerBackWaist,
    );

  lines.back_waistDartBulkRight = movableDartBulkLine;
  lines.back_waistDartBulkLeft = stationaryDartBulkLine;
  lines.back_waistDartCenter = dartCenterLine;
};

export const draftSideSeamBack = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines, curves } = ctx;

  // front armscye guide line also serves as a guide line for back
  lines.back_sideSeam = traceBackSideSeam(
    points.back_sideBust,
    points.back_sideWaist,
    lines.front_armscyeGuide,
  );
};

export const draftArmholeBack = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines, curves } = ctx;

  const outerShoulderProjectedOnArmscye = orthogonallyProjectPointOntoLine(
    points.back_outerShoulder,
    lines.front_armscyeGuide,
  );

  const armscyeMidPoint = midPoint(
    points.back_outerShoulder,
    outerShoulderProjectedOnArmscye,
  );

  // armhole depth point
  points.back_armholeDepth = translatePoint(
    armscyeMidPoint,
    (m.backArmscyeToArmscye - m.backShoulderSpan) / 2,
  );

  // armhole line from outer shoulder to armhole depth
  lines.back_outerShoulderToArmscyeDepth = {
    from: points.back_outerShoulder,
    to: points.back_armholeDepth,
  };

  // armhole curve from armhole depth to side armscye
  // TODO: Improve curves!
  curves.back_armholeDepthToArmscye = curvePoints(
    points.back_armholeDepth,
    lines.back_sideSeam.to,
    { axis: AxisEnumMap.VERTICAL, tension: 0.8 },
    { axis: AxisEnumMap.HORIZONTAL, tension: 0.4 },
  );
};
