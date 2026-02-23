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
  readonly code = "DRAFT_FAILED" as const;
  readonly domain: DomainName;
  readonly details?: string;

  constructor(message: string, domain: DomainName, details?: string) {
    super(message);
    this.name = "DomainError";
    this.domain = domain;
    this.details = details;
  }
}
