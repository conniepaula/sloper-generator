import type { DomainStage, SloperType } from "../slopers/registry";
import { DomainError } from "./domain-error";

interface DomainErrorInput {
  message: string;
  details?: unknown;
  cause?: unknown;
}

export const makeDomainErrorFactory =
  (sloper: SloperType, stage: DomainStage) =>
  ({ message, details, cause }: DomainErrorInput): DomainError =>
    new DomainError(message, {
      sloper,
      stage,
      details,
      cause,
    });
