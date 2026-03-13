import * as z from "zod";
import {
  measurementsSchema,
  type MeasurementMask,
} from "../../../core/slopers/measurements";

const bodiceMeasurementMask: MeasurementMask = {
  bust: true,
  waist: true,
  frontWaistHeight: true,
  backWaistHeight: true,
  bustHeight: true,
  centerFrontHeight: true,
  centerBackHeight: true,
  shoulderSlope: true,
  apexToApex: true,
  shoulderLength: true,
  frontShoulderSpan: true,
  backShoulderSpan: true,
  bustFront: true,
  frontArmscyeToArmscye: true,
  backArmscyeToArmscye: true,
};

export const bodiceMeasurementsSchema = measurementsSchema.pick(
  bodiceMeasurementMask,
);

export type BodiceMeasurements = z.infer<typeof bodiceMeasurementsSchema>;
