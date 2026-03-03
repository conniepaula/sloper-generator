import type { Point } from "../../geometry/geometry.types";
import type { PatternCurve, PatternLine } from "./pattern.types";

export type PatternDraftingContextBase<
  TMeasurements,
  TPoints extends string = string,
  TLine extends string = string,
  TCurves extends string = string,
> = {
  measurements: TMeasurements;
  points: Record<TPoints, Point>;
  lines: Record<TLine, PatternLine>;
  curves: Record<TCurves, PatternCurve>;
};
