import type { Result } from "../core/result";
import { toDraftLayout } from "../domains/draft/draft.toDraftLayout";
import { drafters } from "./drafters";
import { fail, type DraftingError } from "./errors";
import type { SloperMeasurementsMap, SloperType } from "./types";
import type { DraftLayout } from "../domains/draft/draft.types";

export const draftSloper = <TKind extends SloperType>(
  kind: TKind,
  measurements: SloperMeasurementsMap[TKind],
): Result<DraftLayout, DraftingError> => {
  try {
    // draft sloper
    const drafterRes = drafters[kind](measurements);
    if (!drafterRes.ok) return fail("drafter", kind, drafterRes.error);
    // get draft layout
    const draftLayoutRes = toDraftLayout(drafterRes.data);
    if (!draftLayoutRes.ok) return fail("layout", kind, draftLayoutRes.error);
    // draft + layout successful
    return { ok: true, data: draftLayoutRes.data };
  } catch (err) {
    // unexpected error
    return fail("exception", kind, err);
  }
};
