import type { Point } from "../../../geometry/types";
import type { PatternCurve, PatternLine } from "./types";

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
