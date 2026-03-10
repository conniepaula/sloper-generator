import type { DomainStage, SloperType } from "../slopers/registry";
import { DomainError } from "./domain-error";
import { InvariantError } from "./invariant-error";

type DomainBoundaryContext = {
  sloper: SloperType;
  stage: DomainStage;
};

export const isKnownDomainBoundaryError = (
  err: unknown,
): err is DomainError | InvariantError => {
  return err instanceof DomainError || err instanceof InvariantError;
};

export const mapDomainBoundaryError = (
  err: unknown,
  ctx: DomainBoundaryContext,
): DomainError | InvariantError => {
  if (isKnownDomainBoundaryError(err)) {
    return err;
  }

  const message =
    err instanceof Error
      ? err.message
      : `Unexpected non-Error thrown in ${ctx.sloper}/${ctx.stage}`;

  return new DomainError(`${ctx.sloper}/${ctx.stage}: ${message}`, {
    cause: err,
    sloper: ctx.sloper,
    stage: ctx.stage,
    origin: "unexpected",
  });
};
