import { DomainError } from "./domain-error";
import { InvariantError } from "./invariant-error";
import {
  type Result,
  type Success,
  type Failure,
  Ok,
  Err,
  ResultWrapper,
} from "./result";

type ErrorCodes = "DRAFT_FAILED" | "INVARIANT" | "DOMAIN_ERROR";

export {
  type Result,
  type Success,
  type Failure,
  Ok,
  Err,
  ResultWrapper,
  type ErrorCodes,
  DomainError,
  InvariantError,
};
