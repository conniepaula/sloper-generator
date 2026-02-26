export type Success<TData> = { ok: true; data: TData };
export type Failure<TError> = { ok: false; error: TError };
export type Result<D, E> = Success<D> | Failure<E>;
