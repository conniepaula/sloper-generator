export type DomainName = "bodice";
export type DomainStep = string;

export class DomainError extends Error {
  readonly code = "PATTERN_RULE" as const;
  readonly domain: DomainName;
  readonly details?: unknown;

  constructor(message: string, domain: DomainName, details?: unknown) {
    super(message);
    this.name = "DomainError";
    this.domain = domain;
    this.details = details;
  }
}
