type PartitionResult<TItem> = { pass: Array<TItem>; fail: Array<TItem> };

// TODO: Write tests
export const partition = <TItem>(
  array: Array<TItem>,
  predicate: (item: TItem) => boolean,
) => {
  return array.reduce<PartitionResult<TItem>>(
    (res, item) => {
      res[predicate(item) ? "pass" : "fail"].push(item);
      return res;
    },
    { pass: [], fail: [] },
  );
};

export function typedEntries<T extends Record<string, unknown>>(
  obj: T,
): { [K in keyof T]: [K, T[K]] }[keyof T][] {
  return Object.entries(obj) as { [K in keyof T]: [K, T[K]] }[keyof T][];
}
