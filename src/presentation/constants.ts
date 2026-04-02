import type { ErrorCodes } from "../core/errors";

export type UIErrorCodes = ErrorCodes | "EXPORT_ERROR";

export const ERROR_TOAST_TITLE: Record<UIErrorCodes, string> = {
  INVARIANT: "You have found a bug!",
  DRAFT_FAILED: "Unknown error occurred",
  DOMAIN_ERROR: "Check your measurements",
  EXPORT_ERROR: "Error exporting PDF",
} as const;

export const ERROR_TOAST_DESCRIPTION: Record<UIErrorCodes, string> = {
  INVARIANT:
    "This wasn't supposed to happen. Please contact us so we can fix it as soon as possible.",
  DRAFT_FAILED:
    "This error hasn't been brought to our attention yet. We'd appreciate it if you reported it to us.",
  DOMAIN_ERROR:
    "One or more measurements create an impossible pattern shape. Please review the entered values and try again.",
  EXPORT_ERROR:
    "There was an issue exporting your pattern. Please try again later.",
};

export type UISuccessCodes = "DRAFT_SUCCESSFUL" | "EXPORT_SUCCESSFUL";

export const SUCCESS_TOAST_TITLE: Record<UISuccessCodes, string> = {
  DRAFT_SUCCESSFUL: "Successfully generated pattern block",
  EXPORT_SUCCESSFUL: "Successfully exported pattern block",
} as const;
