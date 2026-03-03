import type { BodiceDraftContext } from "../../domains/bodice/bodice.context.types";
import type { BodiceMeasurements } from "../../domains/bodice/bodice.types";

export type SloperMeasurementsMap = { bodice: BodiceMeasurements };
export type SloperContextMap = { bodice: BodiceDraftContext };
export type SloperType = keyof SloperMeasurementsMap;


export type DomainName = SloperType;