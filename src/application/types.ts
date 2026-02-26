import type { DomainError, InvariantError } from "../core/errors";
import type { Result } from "../core/result";
import type { BodiceDraftContext } from "../domains/bodice/bodice.context.types";
import type { BodiceMeasurements } from "../domains/bodice/bodice.types";

export type SloperMeasurementsMap = { bodice: BodiceMeasurements };
export type SloperContextMap = { bodice: BodiceDraftContext };
export type SloperType = keyof SloperMeasurementsMap;

export type DrafterMap = {
  [K in SloperType]: (
    measurements: SloperMeasurementsMap[K],
  ) => Result<SloperContextMap[K], DomainError | InvariantError>;
};
