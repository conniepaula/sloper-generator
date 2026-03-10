import { InvariantError } from "../../core/errors";

export type NonEmptyArray<T> = [T, ...T[]];

export function assertNonEmpty<T>(
  array: T[],
  message: string,
): asserts array is NonEmptyArray<T> {
  if (array.length === 0) {
    // TODO: Add cause
    throw new InvariantError(message);
  }
}

export function assertNonNull<T>(
  value: T,
  message: string,
): asserts value is NonNullable<T> {
  if (value == null) {
    throw new InvariantError(message);
  }
}
