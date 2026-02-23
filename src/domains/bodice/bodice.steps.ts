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
import { addCurve, addLine } from "../draft/draft.helpers";

// DRAFTING STEPS - FRONT BODICE

export const draftBaseFront = (ctx: BodiceDraftContext) => {
  const { measurements: m, points } = ctx;

  const base = createBaseCenterPoints(m.frontWaistHeight);

  points.front_centerTop = base.centerTop;
  points.front_centerWaist = base.centerBottom;
  points.front_sideWaist = translatePoint(
    points.front_centerWaist,
    waistLineLength(m.waist, FRONT_WAIST_DART_DEPTH),
  );

  // add center front guide
  addLine(
    ctx,
    "front",
    "centerFront",
    {
      from: points.front_centerTop,
      to: points.front_centerWaist,
    },
    { name: "Center Front", role: "construction" },
  );

  // add front waist guide
  addLine(
    ctx,
    "front",
    "waistGuide",
    {
      from: points.front_centerWaist,
      to: points.front_sideWaist,
    },
    { name: "Waist Line", role: "construction" },
  );
};

export const draftHelpersFront = (ctx: BodiceDraftContext) => {
  const { measurements: m, points } = ctx;

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
  addLine(
    ctx,
    "front",
    "armscyeGuide",
    {
      from: points.front_centerArmscye,
      to: points.front_sideArmscye,
    },
    { name: "Armscye Line", role: "guide" },
  );

  // Bust guide line
  addLine(
    ctx,
    "front",
    "bustGuide",
    {
      from: points.front_centerBust,
      to: points.front_sideBust,
    },
    { name: "Bust Line", role: "guide" },
  );

  // Shoulder guide line
  addLine(
    ctx,
    "front",
    "shoulderGuide",
    {
      from: points.front_centerTop,
      to: points.front_sideShoulder,
    },
    { name: "Shoulder Guide Line", role: "construction" },
  );
};

export const draftShoulderFront = (ctx: BodiceDraftContext) => {
  const { measurements: m, points } = ctx;

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
  addLine(
    ctx,
    "front",
    "shoulder",
    {
      from: points.front_innerShoulder,
      to: points.front_outerShoulder,
    },
    { name: "Shoulder Line", role: "main_outer" },
  );
};

export const draftNecklineFront = (ctx: BodiceDraftContext) => {
  const { measurements: m, points } = ctx;

  const necklineHeight = m.frontWaistHeight - m.centerFrontHeight;

  // Neckline point
  points.front_centerNeckline = translatePoint(
    points.front_centerTop,
    0,
    necklineHeight,
  );

  // Neckline curve
  const necklineCurve = curvePoints(
    points.front_centerNeckline,
    points.front_innerShoulder,
  );

  addCurve(ctx, "front", "neckline", necklineCurve, {
    name: "Armhole: Segment 2",
    role: "main_outer",
  });

  // Center front neck to waist line
  addLine(
    ctx,
    "front",
    "centerNecklineToWaist",
    {
      from: points.front_centerNeckline,
      to: points.front_centerWaist,
    },
    { name: "Center Neck To Waistline", role: "main_outer" },
  );
};

export const draftWaistFront = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines } = ctx;

  const halfBustApex = m.apexToApex / 2;

  points.front_waistDartApex = { x: halfBustApex, y: m.bustHeight };

  const waistDartApexProjectionOnWaist = orthogonallyProjectPointOntoLine(
    points.front_waistDartApex,
    lines.front_waistGuide.geometry,
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
  addLine(
    ctx,
    "front",
    "waistDartLeftLeg",
    {
      from: points.front_waistDartApex,
      to: points.front_waistDartLeft,
    },
    { name: "Waist Dart: Left Leg", role: "main_inner" },
  );

  addLine(
    ctx,
    "front",
    "waistDartRightLeg",
    {
      from: points.front_waistDartApex,
      to: points.front_waistDartRight,
    },
    { name: "Waist Dart: Right Leg", role: "main_inner" },
  );

  // Drafting dart bulk

  const { movableDartBulkLine, stationaryDartBulkLine, dartCenterLine } =
    createDartBulk(
      points.front_waistDartApex,
      points.front_waistDartRight,
      points.front_waistDartLeft,
      points.front_centerWaist,
    );

  addLine(ctx, "front", "waistDartBulkRight", movableDartBulkLine, {
    name: "Waist Dart Bulk: Right Leg",
    role: "main_outer",
  });
  addLine(ctx, "front", "waistDartBulkLeft", stationaryDartBulkLine, {
    name: "Waist Dart Bulk: Right Leg",
    role: "main_outer",
  });

  addLine(ctx, "front", "waistDartCenter", dartCenterLine, {
    name: "Waist Dart Bulk: Right Leg",
    role: "guide",
  });

  // Drafting waist line segments
  addLine(
    ctx,
    "front",
    "waistCenterToRightDartLeg",
    { from: points.front_centerWaist, to: points.front_waistDartRight },
    {
      name: "Waist: Segment 1",
      role: "main_outer",
    },
  );
  addLine(
    ctx,
    "front",
    "waistLeftDartLegToSideSeam",
    { from: points.front_waistDartLeft, to: points.front_sideWaist },
    {
      name: "Waist: Segment 2",
      role: "main_outer",
    },
  );
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

  addLine(ctx, "front", "armscyeToBustDartSideSeam", topSideSeamSegment, {
    name: "Side Seam: Segment 1",
    role: "main_outer",
  });
  addLine(ctx, "front", "bustDartToWaistSideSeam", bottomSideSeamSegment, {
    name: "Side Seam: Segment 2",
    role: "main_outer",
  });
  addLine(ctx, "front", "bustDartTopLeg", topDartLegLine, {
    name: "Bust Dart: Top Leg",
    role: "main_inner",
  });
  addLine(ctx, "front", "bustDartBottomLeg", bottomDartLegLine, {
    name: "Bust Dart: Bottom Leg",
    role: "main_inner",
  });

  // Drafting bust dart bulk
  const { movableDartBulkLine, stationaryDartBulkLine, dartCenterLine } =
    createDartBulk(
      points.front_bustDartApex,
      lines.front_bustDartBottomLeg.geometry.to,
      lines.front_bustDartTopLeg.geometry.to,
      points.front_sideWaist,
    );

  addLine(ctx, "front", "bustDartBulkBottom", movableDartBulkLine, {
    name: "Bust Dart Bulk: Bottom Leg",
    role: "main_outer",
  });
  addLine(ctx, "front", "bustDartBulkTop", stationaryDartBulkLine, {
    name: "Bust Dart Bulk: Top Leg",
    role: "main_outer",
  });
  addLine(ctx, "front", "bustDartCenter", dartCenterLine, {
    name: "Bust Dart Bulk: Top Leg",
    role: "guide",
  });
};

export const draftArmholeFront = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines } = ctx;

  const outerShoulderProjectionOnArmscye = orthogonallyProjectPointOntoLine(
    points.front_outerShoulder,
    lines.front_armscyeGuide.geometry,
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
  const shoulderToArmholeDepth = curvePoints(
    points.front_outerShoulder,
    points.front_armholeDepth,
    { axis: AxisEnumMap.HORIZONTAL, tension: 0.05 },
  );

  addCurve(ctx, "front", "shoulderToArmholeDepth", shoulderToArmholeDepth, {
    name: "",
    role: "main_outer",
  });

  const armholeDepthToSideArmscye = curvePoints(
    points.front_armholeDepth,
    points.front_sideArmscye,
    { axis: AxisEnumMap.VERTICAL, tension: 0.8 },
    { axis: AxisEnumMap.HORIZONTAL, tension: 0.3 },
  );
  addCurve(
    ctx,
    "front",
    "armholeDepthToSideArmscye",
    armholeDepthToSideArmscye,
    { name: "", role: "main_outer" },
  );
};

// DRAFTING STEPS - BACK BODICE

export const draftBaseBack = (ctx: BodiceDraftContext) => {
  const { measurements: m, points } = ctx;

  const base = createBaseCenterPoints(m.backWaistHeight);

  points.back_centerBackTop = base.centerTop;
  points.back_centerBackWaist = base.centerBottom;
  points.back_sideWaist = translatePoint(
    points.back_centerBackWaist,
    waistLineLength(m.waist, BACK_WAIST_DART_DEPTH),
  );

  addLine(
    ctx,
    "back",
    "centerBack",
    {
      from: points.back_centerBackTop,
      to: points.back_centerBackWaist,
    },
    {
      name: "Center Back",
      role: "construction",
    },
  );
  addLine(
    ctx,
    "back",
    "waistGuide",
    {
      from: points.back_centerBackWaist,
      to: points.back_sideWaist,
    },
    {
      name: "Back Waist",
      role: "construction",
    },
  );
};

export const draftHelpersBack = (ctx: BodiceDraftContext) => {
  const { measurements: m, points } = ctx;

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
  addLine(
    ctx,
    "back",
    "bustGuide",
    {
      from: points.front_centerBust,
      to: points.back_sideBust,
    },
    {
      name: "Bust Guide",
      role: "guide",
    },
  );

  // Shoulder guide line
  addLine(
    ctx,
    "back",
    "shoulderGuide",
    {
      from: points.back_centerBackTop,
      to: points.back_sideShoulder,
    },
    {
      name: "Shoulder Guide",
      role: "construction",
    },
  );
};

export const draftShoulderBack = (ctx: BodiceDraftContext) => {
  const { measurements: m, points } = ctx;

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
  addLine(
    ctx,
    "back",
    "shoulder",
    {
      from: points.back_innerShoulder,
      to: points.back_outerShoulder,
    },
    {
      name: "Back Shoulder",
      role: "main_outer",
    },
  );
};

export const draftNecklineBack = (ctx: BodiceDraftContext) => {
  const { measurements: m, points } = ctx;

  const necklineHeight = m.backWaistHeight - m.centerBackHeight;

  // neckline point
  points.back_centerBackNeckline = translatePoint(
    points.back_centerBackTop,
    0,
    necklineHeight,
  );

  // neckline curve
  const necklineCurve = curvePoints(
    points.back_centerBackNeckline,
    points.back_innerShoulder,
  );

  addCurve(ctx, "back", "neckline", necklineCurve, {
    name: "Neckline",
    role: "main_outer",
  });

  // center back neckline to waist
  addLine(
    ctx,
    "back",
    "centerNecklineToWaist",
    {
      from: points.back_centerBackNeckline,
      to: points.back_centerBackWaist,
    },
    {
      name: "Center Back",
      role: "main_outer",
    },
  );
};

export const draftWaistBack = (ctx: BodiceDraftContext) => {
  const { points, lines } = ctx;

  const waistHalfwayPoint = midPoint(
    points.back_centerBackWaist,
    points.back_sideWaist,
  );

  points.back_waistDartApex = orthogonallyProjectPointOntoLine(
    waistHalfwayPoint,
    lines.front_bustGuide.geometry,
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
  addLine(
    ctx,
    "back",
    "waistDartLeftLeg",
    {
      from: points.back_waistDartApex,
      to: points.back_waistDartLeft,
    },
    {
      name: "Waist Dart: Left Leg",
      role: "main_inner",
    },
  );
  addLine(
    ctx,
    "back",
    "waistDartRightLeg",
    {
      from: points.back_waistDartApex,
      to: points.back_waistDartRight,
    },
    {
      name: "Waist Dart: Right Leg",
      role: "main_inner",
    },
  );

  // Drafting dart bulk

  const { movableDartBulkLine, stationaryDartBulkLine, dartCenterLine } =
    createDartBulk(
      points.back_waistDartApex,
      points.back_waistDartRight,
      points.back_waistDartLeft,
      points.back_centerBackWaist,
    );

  addLine(ctx, "back", "waistDartBulkRight", movableDartBulkLine, {
    name: "Waist Dart Bulk: Right Leg",
    role: "main_inner",
  });
  addLine(ctx, "back", "waistDartBulkLeft", stationaryDartBulkLine, {
    name: "Waist Dart Bulk: Left Leg",
    role: "main_inner",
  });
  addLine(ctx, "back", "waistDartCenter", dartCenterLine, {
    name: "Waist Dart Bulk: Center Line",
    role: "guide",
  });

  // Drafting waist line segments
  addLine(
    ctx,
    "back",
    "waistCenterToRightDartLeg",
    { from: points.back_centerBackWaist, to: points.back_waistDartRight },
    {
      name: "Waist: Segment 1",
      role: "main_outer",
    },
  );
  addLine(
    ctx,
    "back",
    "waistLeftDartLegToSideSeam",
    { from: points.back_waistDartLeft, to: points.back_sideWaist },
    {
      name: "Waist: Segment 2",
      role: "main_outer",
    },
  );
};

export const draftSideSeamBack = (ctx: BodiceDraftContext) => {
  const { points, lines } = ctx;

  // front armscye guide line also serves as a guide line for back

  const sideSeam = traceBackSideSeam(
    points.back_sideBust,
    points.back_sideWaist,
    lines.front_armscyeGuide.geometry,
  );

  addLine(ctx, "back", "sideSeam", sideSeam, {
    name: "Side Seam",
    role: "main_outer",
  });
};

export const draftArmholeBack = (ctx: BodiceDraftContext) => {
  const { measurements: m, points, lines } = ctx;

  const outerShoulderProjectedOnArmscye = orthogonallyProjectPointOntoLine(
    points.back_outerShoulder,
    lines.front_armscyeGuide.geometry,
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
  addLine(
    ctx,
    "back",
    "outerShoulderToArmscyeDepth",
    {
      from: points.back_outerShoulder,
      to: points.back_armholeDepth,
    },
    {
      name: "Armhole: Segment 1",
      role: "main_outer",
    },
  );

  // armhole curve from armhole depth to side armscye
  // TODO: Improve curves!
  const armholeDepthToArmscye = curvePoints(
    points.back_armholeDepth,
    lines.back_sideSeam.geometry.to,
    { axis: AxisEnumMap.VERTICAL, tension: 0.8 },
    { axis: AxisEnumMap.HORIZONTAL, tension: 0.4 },
  );

  addCurve(ctx, "back", "armholeDepthToArmscye", armholeDepthToArmscye, {
    name: "Armhole: Segment 2",
    role: "main_outer",
  });
};
