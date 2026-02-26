import { DomainError, InvariantError, type ErrorCodes } from "../core/errors";
import type { Failure } from "../core/result";
import type { SloperType } from "./types";

type DraftStage = "drafter" | "layout" | "exception";

export type DraftingError = {
  code: ErrorCodes;
  message: string;
  stage: DraftStage;
  details?: unknown;
};

/*
 * Given the stage where draftSloper failed and the type of sloper it was drafting, it returns DraftingError wrapped by Result.
 */
export const fail = (
  stage: DraftStage,
  kind: SloperType,
  err: unknown,
): Failure<DraftingError> => {
  const draftingErr = toDraftingError(err, stage);
  const ctx = {
    stage,
    kind,
    code: draftingErr.code,
    message: draftingErr.message,
    details: draftingErr.details,
  };

  if (draftingErr.code === "DRAFT_RULE") {
    console.warn(ctx);
  } else {
    console.error(ctx, err);
  }

  return { ok: false, error: draftingErr };
};

/*
 * Takes an unknown error type, logs it if it's not a domain error and returns the error in the DraftingError shape for UI.
 */
const toDraftingError = (err: unknown, stage: DraftStage): DraftingError => {
  if (err instanceof DomainError) {
    return {
      code: err.code,
      message: err.message,
      stage,
      details: { domain: err.domain, step: err.details },
    };
  }
  if (err instanceof InvariantError) {
    return { code: err.code, message: err.message, stage };
  }
  return {
    code: "DRAFT_FAILED",
    message: "An unknown error occurred.",
    stage,
  };
};
