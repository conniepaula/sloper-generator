import { arePointsEqual } from "../../../geometry/helpers";
import type { Point } from "../../../geometry/types";
import { assertNonEmpty, assertNonNull } from "../../../shared/utils/assert";
import { InvariantError } from "../../errors";
import type { Contour, ContourCandidates, ContourSegment } from "./types";

export const startPoint = (seg: ContourSegment): Point => {
  if (seg.kind === "line") return seg.geometry.from;
  return seg.geometry.start;
};

export const endPoint = (seg: ContourSegment): Point => {
  if (seg.kind === "line") return seg.geometry.to;
  return seg.geometry.end;
};

export const reverseSegment = (seg: ContourSegment): ContourSegment => {
  if (seg.kind === "line")
    return {
      ...seg,
      geometry: {
        from: seg.geometry.to,
        to: seg.geometry.from,
      },
    };
  return {
    ...seg,
    geometry: {
      start: seg.geometry.end,
      control1: seg.geometry.control2,
      end: seg.geometry.start,
      control2: seg.geometry.control1,
    },
  };
};

export const matches = (
  currentEnd: Point,
  next: ContourSegment,
): "forward" | "reversed" | null => {
  if (arePointsEqual(currentEnd, startPoint(next))) return "forward";
  if (arePointsEqual(currentEnd, endPoint(next))) return "reversed";
  return null;
};

export const extractContour = (candidates: ContourCandidates): Contour => {
  assertNonEmpty(
    candidates.segments,
    "extractContour: no segments to extract contour from",
  );

  const remaining = [...candidates.segments];
  const first = remaining.shift();

  assertNonNull(first, "extractContour: first contour segment not defined");

  const contour = [first];
  let currentEnd = endPoint(contour[contour.length - 1]);
  while (remaining.length > 0) {
    let found = false;
    for (let i = 0; i < remaining.length; i++) {
      const next = remaining[i];
      const match = matches(currentEnd, next);
      if (match) {
        found = true;
        const toPush = match === "forward" ? next : reverseSegment(next);
        contour.push(toPush);
        currentEnd = endPoint(toPush);
        remaining.splice(i, 1);
        break;
      }
    }
    if (found === false) break;
  }

  if (!arePointsEqual(startPoint(first), currentEnd)) {
    throw new InvariantError("extractContour: contour loop does not close");
  }

  return { segments: contour, kind: "contour" };
};
