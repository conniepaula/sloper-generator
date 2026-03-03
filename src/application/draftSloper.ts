import { Err, ResultWrapper as R, type Result } from "../core/utils/result";
import { toPatternLayout } from "../core/pattern/pattern.context.toLayout";
import type { PatternLayout } from "../core/pattern/pattern.types";
import { drafters } from "./drafters";
import { fail, type DraftingError } from "./errors";
import type { SloperMeasurementsMap, SloperType } from "./types";

export const draftSloper = <TKind extends SloperType>(
  kind: TKind,
  measurements: SloperMeasurementsMap[TKind],
): Result<PatternLayout, DraftingError> => {
  try {
    return R(drafters[kind](measurements))
      .andThen((data) => toPatternLayout(data))
      .mapErr((err) => fail("layout", kind, err))
      .unwrap();
  } catch (err) {
    // unexpected error
    return Err(fail("exception", kind, err));
  }
};
