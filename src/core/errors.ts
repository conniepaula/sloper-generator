export type ErrorCodes = "DRAFT_FAILED" | "INVARIANT" | "DRAFT_RULE";

// TODO: Add cause

export class InvariantError extends Error {
  readonly code = "INVARIANT" as const;
  constructor(message: string) {
    super(message);
    this.name = "InvariantError";
  }
}

export type DomainName = "bodice" | "draft";
export type DomainStep = string;

export class DomainError extends Error {
  readonly code = "DRAFT_RULE" as const;
  readonly domain: DomainName;
  readonly details?: unknown;

  constructor(message: string, domain: DomainName, details?: unknown) {
    super(message);
    this.name = "DomainError";
    this.domain = domain;
    this.details = details;
  }
}
