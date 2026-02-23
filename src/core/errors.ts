export class InvariantError extends Error {
  readonly CODE = "INVARIANT" as const;
  constructor(message: string) {
    super(message);
    this.name = "InvariantError";
  }
}

export class DomainError extends Error {
  readonly CODE = "DRAFT_FAILED" as const;

  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}
