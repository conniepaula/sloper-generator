import { InvariantError } from "../errors";
import { type Result } from "../errors/Result";
import { Err } from "../utils/result";
import { composePatternLayout } from "./pattern.composeLayout";
import { contextToPatternModel } from "./pattern.context.toModel";
import type { PatternDraftingContextBase } from "./pattern.context.types";
import type { PatternLayout } from "./pattern.types";

type LayoutOptions = {
  spacing?: number;
};

export const toPatternLayout = <
  TMeasurements,
  TPoints extends string,
  TLine extends string,
  TCurves extends string,
>(
  ctx: PatternDraftingContextBase<TMeasurements, TPoints, TLine, TCurves>,
  opts: LayoutOptions = {},
): Result<PatternLayout, InvariantError | Error> => {
  const { spacing = 3 } = opts;

  try {
    const document = contextToPatternModel(ctx);
    const layout = composePatternLayout(document, spacing);
    return { ok: true, data: layout };
  } catch (err) {
    if (err instanceof InvariantError) {
      return Err(err);
    }
    return Err(
      new Error("toLayout: An unknown error has occurred.", {
        cause: err,
      }),
    );
  }
};
