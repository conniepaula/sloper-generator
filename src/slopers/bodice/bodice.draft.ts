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
import { walkSeams } from "../../core/pattern/drafting/helpers";
import { DomainError, InvariantError, type Result } from "../../core/errors";
import { Err, Ok } from "../../core/errors/result";
import { mapDomainBoundaryError } from "../../core/errors/domain-boundary-error-mapper";

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
): Result<BodiceDraftContext, DomainError | InvariantError> => {
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
        sloper: "bodice",
        errorMessage:
          "Bodice front and back side seam lengths are different. Check your measurements.",
      },
    );
    // walk shoulder seams:
    walkSeams(
      ctx.lines.front_shoulder.geometry,
      ctx.lines.back_shoulder.geometry,
      {
        sloper: "bodice",
        errorMessage:
          "Bodice front and back shoulder lengths are different. Check your measurements.",
      },
    );

    return Ok(ctx);
  } catch (err) {
    Err(mapDomainBoundaryError(err, { sloper: "bodice", stage: "drafting" }));
  }
};
