import { expect, test } from "vitest";

import {
  draftBaseFront,
  draftHelpersFront,
  draftShoulderFront,
  draftWaistFront,
  draftBustDartAndSideSeamFront,
  draftBaseBack,
  draftHelpersBack,
  draftShoulderBack,
  draftSideSeamBack,
} from "./bodice.steps";
import { MOCK_MEASUREMENTS } from "./bodice.constants";
import type {
  BodiceDraftContext,
  CurvesRecord,
  LinesRecord,
  PointsRecord,
} from "./bodice.context.types";

import { lineLength } from "../../geometry/geometry.helpers";

// TODO: Add function that walks seams so i can throw an error if there's an issue

test("front and back shoulder seams are of approximately equal length", () => {
  const ctx: BodiceDraftContext = {
    measurements: MOCK_MEASUREMENTS,
    points: {} as PointsRecord,
    lines: {} as LinesRecord,
    curves: {} as CurvesRecord,
  };

  // run necessary drafting steps for front and back shoulders
  draftBaseFront(ctx);
  draftHelpersFront(ctx);
  draftShoulderFront(ctx);

  draftBaseBack(ctx);
  // draftHelpersBack uses front_centerBust which is added in draftHelpersFront
  draftHelpersBack(ctx);
  draftShoulderBack(ctx);

  const frontShoulder = ctx.lines.front_shoulder;
  const backShoulder = ctx.lines.back_shoulder;

  expect(frontShoulder).toBeDefined();
  expect(backShoulder).toBeDefined();

  const frontLen = lineLength(frontShoulder.geometry);
  const backLen = lineLength(backShoulder.geometry);

  const diff = Math.abs(frontLen - backLen);

  // allow small difference
  expect(diff).toBeLessThanOrEqual(0.3);
});

test("side seam (front two segments) matches back side seam length", () => {
  const ctx: BodiceDraftContext = {
    measurements: MOCK_MEASUREMENTS,
    points: {},
    lines: {},
    curves: {},
  };

  // build front geometry including bust darts and side seams
  draftBaseFront(ctx);
  draftHelpersFront(ctx);
  draftWaistFront(ctx);
  draftBustDartAndSideSeamFront(ctx);

  // build back geometry and side seam
  draftBaseBack(ctx);
  draftHelpersBack(ctx);
  draftSideSeamBack(ctx);

  const seg1 = ctx.lines.front_armscyeToBustDartSideSeam.geometry;
  const seg2 = ctx.lines.front_bustDartToWaistSideSeam.geometry;
  const backSide = ctx.lines.back_sideSeam.geometry;

  expect(seg1).toBeDefined();
  expect(seg2).toBeDefined();
  expect(backSide).toBeDefined();

  const frontSum = lineLength(seg1) + lineLength(seg2);
  const backLen = lineLength(backSide);

  const diff = Math.abs(frontSum - backLen);

  // allow small difference
  expect(diff).toBeLessThanOrEqual(0.3);
});
