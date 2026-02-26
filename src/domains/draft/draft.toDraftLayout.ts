import { InvariantError } from "../../core/errors";
import type { Result } from "../../core/result";
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
): Result<DraftLayout, InvariantError> => {
  const { spacing = 3 } = opts;

  try {
    const document = contextToDraftDocument(ctx);
    const layout = composeDraftLayout(document, spacing);
    return { ok: true, data: layout };
  } catch (err) {
    if (err instanceof InvariantError) {
      return { ok: false, error: err };
    }
    return {
      ok: false,
      error: new InvariantError(
        "toDraftLayout: An unknown error has occurred.",
      ),
    };
  }
};
