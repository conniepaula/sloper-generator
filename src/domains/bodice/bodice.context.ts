import type { BodiceDraftContext, CurvesRecord, LinesRecord, PointsRecord } from "./bodice.context.types";
import type { BodiceMeasurements } from "./bodice.types";

export const createBodiceDraftContext = (
  measurements: BodiceMeasurements,
): BodiceDraftContext => ({
  measurements,
  points: {} as PointsRecord,
  lines: {} as LinesRecord,
  curves: {} as CurvesRecord,
});
