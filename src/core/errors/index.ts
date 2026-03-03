import { DomainError } from "./DomainError";
import { InvariantError } from "./InvariantError";
import { type Result, type Success, type Failure } from "./Result";

type ErrorCodes = "DRAFT_FAILED" | "INVARIANT" | "PATTERN_RULE";

export {type Result, type Success, type Failure, type ErrorCodes, DomainError, InvariantError,}