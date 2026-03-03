export class InvariantError extends Error {
  readonly code = "INVARIANT" as const;
  constructor(message: string) {
    super(message);
    this.name = "InvariantError";
  }
}
