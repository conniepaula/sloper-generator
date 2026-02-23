import { DomainError, InvariantError } from "../core/errors";
import type { Result } from "../core/result";
import { draftBodice } from "../domains/bodice/bodice.draft";
import type { BodiceMeasurements } from "../domains/bodice/bodice.types";
import { composeDraftLayout } from "../domains/draft/draft.composeLayout";
import { contextToRawDraft } from "../domains/draft/draft.context.toRawDraft";
import type { DraftDocument } from "../domains/draft/draft.types";
import type { DraftError } from "./errors";

type SloperMeasurementsMap = { bodice: BodiceMeasurements };
type SloperType = keyof SloperMeasurementsMap;

type DrafterMap = {
  [K in SloperType]: (
    measurements: SloperMeasurementsMap[K],
  ) => Result<DraftDocument, DraftError>;
};

const drafters: DrafterMap = {
  bodice: (measurements) => {
    const ctx = draftBodice(measurements);
    const rawDraft = contextToRawDraft(ctx);
    const draftDocument = composeDraftLayout(rawDraft, 3);
    return { ok: true, data: draftDocument };
  },
};

export const draftSloper = <TKind extends SloperType>(
  kind: TKind,
  measurements: SloperMeasurementsMap[TKind],
): Result<DraftDocument, DraftError> => {
  try {
    return drafters[kind](measurements);
  } catch (err) {
    if (err instanceof DomainError) {
      return {
        ok: false,
        error: { code: "DRAFT_FAILED", message: err.message },
      };
    }
    if (err instanceof InvariantError) {
      return { ok: false, error: { code: "INVARIANT", message: err.message } };
    }
    return {
      ok: false,
      error: { code: "INVARIANT", message: "Unexpected error." },
    };
  }
};
