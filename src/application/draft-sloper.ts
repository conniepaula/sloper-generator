import type { Result } from "../core/errors";
import { toPatternLayout } from "../core/pattern/layout/context.to-layout";
import type { PatternLayout } from "../core/pattern/drafting/types";
import type {
  SloperMeasurementsMap,
  SloperType,
} from "../core/slopers/registry";
import { Err, ResultWrapper as R } from "../core/errors/result";
import { drafters } from "./drafters";
import { fail, type DraftingError } from "./errors";

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
