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
import { walkSeams } from "../draft/draft.helpers";
import { DomainError, InvariantError } from "../../core/errors";
import type { Result } from "../../core/result";
import { BodiceError } from "./bodice.errors";

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

export const draftBodice = (
  measurements: BodiceMeasurements,
): Result<BodiceDraftContext, BodiceError | InvariantError> => {
  const ctx = createBodiceDraftContext(measurements);

  try {
    draftFrontBodice(ctx);
    draftBackBodice(ctx);
    // walk side seams:
    walkSeams(
      [
        ctx.lines.front_armscyeToBustDartSideSeam.geometry,
        ctx.lines.front_bustDartToWaistSideSeam.geometry,
      ],
      ctx.lines.back_sideSeam.geometry,
      {
        errorMessage:
          "Bodice front and back side seam lengths are different. Check your measurements.",
      },
    );
    // walk shoulder seams:
    walkSeams(
      ctx.lines.front_shoulder.geometry,
      ctx.lines.back_shoulder.geometry,
      {
        errorMessage:
          "Bodice front and back shoulder lengths are different. Check your measurements.",
      },
    );

    return { ok: true, data: ctx };
  } catch (err) {
    if (err instanceof BodiceError) {
      return {
        ok: false,
        error: err,
      };
    }
    if (err instanceof DomainError) {
      // error comes from shared domain utilities
      return {
        ok: false,
        error: new BodiceError(err.message, err.details),
      };
    }
    return {
      ok: false,
      // TODO: Fix error
      error: new InvariantError(err?.message ?? "An unknown error occurred."),
    };
  }
};
