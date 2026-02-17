import type { Point } from "../../geometry/geometry.types";
import type { DraftCurve, DraftLine } from "./draft.types";

export type DraftContextBase<
  TMeasurements,
  TPoints extends string = string,
  TLine extends string = string,
  TCurves extends string = string,
> = {
  measurements: TMeasurements;
  points: Record<TPoints, Point>;
  lines: Record<TLine, DraftLine>;
  curves: Record<TCurves, DraftCurve>;
};
