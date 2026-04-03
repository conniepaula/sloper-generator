import type { BodiceDraftContext } from "../../slopers/bodice/bodice.context.types";
import { DEFAULT_MEASUREMENTS } from "../../slopers/bodice/measurements/defaults";
import {
  bodiceMeasurementsSchema,
  type BodiceMeasurements,
} from "../../slopers/bodice/measurements/schema";

export type SloperMeasurementsMap = { bodice: BodiceMeasurements };
export type SloperContextMap = { bodice: BodiceDraftContext };
export type SloperType = keyof SloperMeasurementsMap;

export const measurementSchemaBySloper = {
  bodice: {
    schema: bodiceMeasurementsSchema,
    defaultValue: DEFAULT_MEASUREMENTS,
  },
};

export const getMeasurementsSchema = (sloperType: SloperType) => {
  return measurementSchemaBySloper[sloperType];
};

export type DomainStage = "drafting" | "contours" | "layout" | "render-model";
