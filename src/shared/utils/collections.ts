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
