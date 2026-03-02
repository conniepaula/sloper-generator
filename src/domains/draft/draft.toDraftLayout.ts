import { InvariantError } from "../../core/errors";
import { Err, type Result } from "../../core/result";
import { composeDraftLayout } from "./draft.composeLayout";
import { contextToDraftDocument } from "./draft.context.toDraftDocument";
import type { DraftContextBase } from "./draft.context.types";
import type { DraftLayout } from "./draft.types";

type LayoutOptions = {
  spacing?: number;
};

export const toDraftLayout = <
  TMeasurements,
  TPoints extends string,
  TLine extends string,
  TCurves extends string,
>(
  ctx: DraftContextBase<TMeasurements, TPoints, TLine, TCurves>,
  opts: LayoutOptions = {},
): Result<DraftLayout, InvariantError | Error> => {
  const { spacing = 3 } = opts;

  try {
    const document = contextToDraftDocument(ctx);
    const layout = composeDraftLayout(document, spacing);
    return { ok: true, data: layout };
  } catch (err) {
    if (err instanceof InvariantError) {
      return Err(err);
    }
    return Err(
      new Error("toDraftLayout: An unknown error has occurred.", {
        cause: err,
      }),
    );
  }
};
