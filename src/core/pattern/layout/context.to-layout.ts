import { InvariantError } from "../../errors";
import { type Result } from "../../errors/result";
import { Err } from "../../errors/result";
import { composePatternLayout } from "./compose-layout";
import { contextToPatternModel } from "../drafting/context.toModel";
import type { PatternDraftingContextBase } from "../drafting/context.types";
import type { PatternLayout } from "../drafting/types";

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
