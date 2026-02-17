import type { CubicBezier, Line, Point } from "../../geometry/geometry.types";

export type DraftContextBase<
  TMeasurements,
  TPoints extends string,
  TLine extends string,
  TCurves extends string,
> = {
  measurements: TMeasurements;
  points: Record<TPoints, Point>;
  lines: Record<TLine, Line>;
  curves: Record<TCurves, CubicBezier>;
};
