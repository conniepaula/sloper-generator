import type { ErrorCodes } from "../core/errors";

export const ERROR_TOAST_TITLE: Record<ErrorCodes, string> = {
  INVARIANT: "You have found a bug!",
  DRAFT_FAILED: "Unknown error occurred",
  DOMAIN_ERROR: "Please check your measurements",
} as const;

export const ERROR_TOAST_DESCRIPTION: Record<ErrorCodes, string> = {
  INVARIANT:
    "This wasn't supposed to happen. Please contact us so we can fix it as soon as possible.",
  DRAFT_FAILED:
    "This error hasn't been brought to our attention yet. We'd appreciate it if you reported it to us.",
  DOMAIN_ERROR:
    "One or more measurements create an impossible pattern shape. Please review the entered values and try again.",
};
