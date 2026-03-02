import { Err, ResultWrapper as R, type Result } from "../core/result";
import { toDraftLayout } from "../domains/draft/draft.toDraftLayout";
import type { DraftLayout } from "../domains/draft/draft.types";
import { drafters } from "./drafters";
import { fail, type DraftingError } from "./errors";
import type { SloperMeasurementsMap, SloperType } from "./types";

export const draftSloper = <TKind extends SloperType>(
  kind: TKind,
  measurements: SloperMeasurementsMap[TKind],
): Result<DraftLayout, DraftingError> => {
  try {
    return R(drafters[kind](measurements))
      .andThen((data) => toDraftLayout(data))
      .mapErr((err) => fail("layout", kind, err))
      .unwrap();
  } catch (err) {
    // unexpected error
    return Err(fail("exception", kind, err));
  }
};
