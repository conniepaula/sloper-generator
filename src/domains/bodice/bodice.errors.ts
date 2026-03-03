import { DomainError } from "../../core/utils/errors";

export class BodiceError extends DomainError {
  constructor(message: string, details?: unknown) {
    super(message, "bodice", details);
    this.name = "BodiceError";
  }
}
