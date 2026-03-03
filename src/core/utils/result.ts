import type { Failure, Result, Success } from "../errors/Result";

export const Ok = <TData>(data: TData): Success<TData> => ({ ok: true, data });
export const Err = <TError>(err: TError): Failure<TError> => ({
  ok: false,
  error: err,
});


type ResultOpts<D, E> = {
  andThen<D2, E2>(fn: (data: D) => Result<D2, E2>): ResultOpts<D2, E | E2>;
  map<D2>(fn: (data: D) => D2): ResultOpts<D2, E>;
  mapErr<E2>(fn: (error: E) => E2): ResultOpts<D, E2>;
  unwrap(): Result<D, E>;
};

export const ResultWrapper = <D, E>(result: Result<D, E>): ResultOpts<D, E> => {
  return {
    andThen(fn) {
      if (!result.ok) return ResultWrapper(result);
      return ResultWrapper(fn(result.data));
    },
    map(fn) {
      if (!result.ok) return ResultWrapper(result);
      return ResultWrapper(Ok(fn(result.data)));
    },
    mapErr(fn) {
      if (result.ok) return ResultWrapper(result);
      return ResultWrapper(Err(fn(result.error)));
    },
    unwrap() {
      return result;
    },
  };
};
