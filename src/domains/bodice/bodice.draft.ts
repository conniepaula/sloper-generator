import type { BodiceMeasurements } from "./bodice.types";
import type { BodiceDraftContext } from "./bodice.context.types";
import { createBodiceDraftContext } from "./bodice.context";
import {
  draftArmholeBack,
  draftArmholeFront,
  draftBaseBack,
  draftBaseFront,
  draftBustDartAndSideSeamFront,
  draftHelpersBack,
  draftHelpersFront,
  draftNecklineBack,
  draftNecklineFront,
  draftShoulderBack,
  draftShoulderFront,
  draftSideSeamBack,
  draftWaistBack,
  draftWaistFront,
} from "./bodice.steps";

const draftFrontBodice = (ctx: BodiceDraftContext) => {
  draftBaseFront(ctx);
  draftHelpersFront(ctx);
  draftShoulderFront(ctx);
  draftNecklineFront(ctx);
  draftWaistFront(ctx);
  draftBustDartAndSideSeamFront(ctx);
  draftArmholeFront(ctx);
};

const draftBackBodice = (ctx: BodiceDraftContext) => {
  draftBaseBack(ctx);
  draftHelpersBack(ctx);
  draftShoulderBack(ctx);
  draftNecklineBack(ctx);
  draftWaistBack(ctx);
  draftSideSeamBack(ctx);
  draftArmholeBack(ctx);
};

export const draftBodice = (measurements: BodiceMeasurements) => {
  const ctx = createBodiceDraftContext(measurements);

  draftFrontBodice(ctx);
  draftBackBodice(ctx);

  return ctx;
};
