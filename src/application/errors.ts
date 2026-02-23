type DraftErrorCodes = "DRAFT_FAILED" | "INVARIANT";

export type DraftError = { code: DraftErrorCodes; message: string };
