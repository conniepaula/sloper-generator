import type { DomainError, InvariantError, Result } from "../core/errors";
import type { SloperContextMap, SloperMeasurementsMap, SloperType } from "../core/slopers/registry";
import { draftBodice } from "../domains/bodice/bodice.draft";


export type DrafterMap = {
  [K in SloperType]: (
    measurements: SloperMeasurementsMap[K],
  ) => Result<SloperContextMap[K], DomainError | InvariantError | Error>;
};


export const drafters: DrafterMap = {
  bodice: (measurements) => {
    return draftBodice(measurements);
  },
};
