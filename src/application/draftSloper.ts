import type { Result } from "../core/result";
import { draftBodice } from "../domains/bodice/bodice.draft";
import type { BodiceMeasurements } from "../domains/bodice/bodice.types";
import { composeDraftLayout } from "../domains/draft/draft.composeLayout";
import { contextToRawDraft } from "../domains/draft/draft.context.toRawDraft";
import type { DraftDocument } from "../domains/draft/draft.types";
import { toDraftingError, type DraftingError } from "./errors";

type SloperMeasurementsMap = { bodice: BodiceMeasurements };
type SloperType = keyof SloperMeasurementsMap;

type DrafterMap = {
  [K in SloperType]: (
    measurements: SloperMeasurementsMap[K],
  ) => Result<DraftDocument, DraftingError>;
};

const drafters: DrafterMap = {
  bodice: (measurements) => {
    const result = draftBodice(measurements);
    if (!result.ok) return result;
    const rawDraft = contextToRawDraft(result.data);
    const draftDocument = composeDraftLayout(rawDraft, 3);
    return { ok: true, data: draftDocument };
  },
};

export const draftSloper = <TKind extends SloperType>(
  kind: TKind,
  measurements: SloperMeasurementsMap[TKind],
): Result<DraftDocument, DraftingError> => {
  try {
    return drafters[kind](measurements);
  } catch (err) {
    return { ok: false, error: toDraftingError(err) };
  }
};
