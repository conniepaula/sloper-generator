import { DomainError, InvariantError } from "../core/errors";

type DraftingErrorCodes = "DRAFT_FAILED" | "INVARIANT";

export type DraftingError = {
  code: DraftingErrorCodes;
  message: string;
  details?: unknown;
};

export const toDraftingError = (err: unknown): DraftingError => {
  if (err instanceof DomainError) {
    return {
      code: err.code,
      message: err.message,
      details: { domain: err.domain, step: err.details },
    };
  }
  if (err instanceof InvariantError) {
    return { code: err.code, message: err.message };
  }
  return {
    code: "INVARIANT",
    message: "An unknown error occurred.",
  };
};
