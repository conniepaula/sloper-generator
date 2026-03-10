import type { DomainStage, SloperType } from "../slopers/registry";

type DomainErrorOptions = {
  sloper: SloperType;
  stage: DomainStage;
  details?: unknown;
  cause?: unknown;
  readonly origin?: "expected" | "unexpected";
};

export class DomainError extends Error {
  readonly code = "DOMAIN_ERROR" as const;
  readonly sloper: SloperType;
  readonly stage: DomainStage;
  readonly origin: "expected" | "unexpected";
  readonly details?: unknown;

  constructor(message: string, options: DomainErrorOptions) {
    super(message, { cause: options.cause });
    this.name = "DomainError";
    this.sloper = options.sloper;
    this.stage = options.stage;
    this.details = options.details;
    this.origin = options.origin ?? "expected";

    Object.setPrototypeOf(this, DomainError.prototype);
  }
}
