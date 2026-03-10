import type { CurveEntity, LineEntity } from "../drafting/types";

type ContourLine = Pick<LineEntity, "kind" | "geometry" | "id" | "exportable">;

type ContourCurve = Pick<
  CurveEntity,
  "kind" | "geometry" | "id" | "exportable"
>;

/**
 * Segment shape used by contour-processing pipelines.
 */
export type ContourSegment = ContourLine | ContourCurve;

/**
 * @property segments - Filtered but unordered array of shape `ContourSegment`
 */
export type ContourCandidates = {
  segments: Array<ContourSegment>;
  kind: "contour_candidates";
};

/**
 * @property segments - Ordered, filtered and validated  array of shape `ContourSegment` that forms a closed-loop.
 */
export type Contour = { segments: Array<ContourSegment>; kind: "contour" };

/**
 * Collection of multiple contours.
 */
export type Contours = Array<Contour>;
