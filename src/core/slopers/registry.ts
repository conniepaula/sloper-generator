import type { BodiceDraftContext } from "../../slopers/bodice/bodice.context.types";
import type { BodiceMeasurements } from "../../slopers/bodice/bodice.types";

export type SloperMeasurementsMap = { bodice: BodiceMeasurements };
export type SloperContextMap = { bodice: BodiceDraftContext };
export type SloperType = keyof SloperMeasurementsMap;

export type DomainStage = "drafting" | "contours" | "layout" | "render-model";
