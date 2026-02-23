import { InvariantError } from "./errors";

export type NonEmptyArray<T> = [T, ...T[]];

export function assertNonEmpty<T>(
  array: T[],
  message: string,
): asserts array is NonEmptyArray<T> {
  if (array.length === 0) {
    throw new InvariantError(message);
  }
}
