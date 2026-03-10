import type { Entities, Entity } from "../drafting/types";
import { matchesSelector, type Selector } from "./selectors";
import type { ContourCandidates, ContourSegment } from "./types";

/**
 * Receives an `Entity` and if it's `LineEntity` or `CurveEntity`, turns it into a `ContourSegment`.
 * Otherwise, returns null.
 */
export const toContourSegment = (entity: Entity): ContourSegment | null => {
  if (entity.kind === "line") {
    return {
      id: entity.id,
      kind: "line" as const,
      geometry: entity.geometry,
      exportable: true,
    };
  }
  if (entity.kind === "curve") {
    return {
      id: entity.id,
      kind: "curve" as const,
      geometry: entity.geometry,
      exportable: true,
    };
  }
  return null;
};

/**
 * Converts an array of `Entity` into `ContourCandidates`. Optionally, filters using selectors.
 * Example usage would be to transform entities with `role = "main_outer"` into contour segments.
 */
export const toContourSegments = (
  entities: Entities,
  selector: Selector = {},
): ContourCandidates => {
  const segArr = entities
    .filter((ent) => matchesSelector(ent, selector))
    .flatMap((ent) => {
      const seg = toContourSegment(ent);
      return seg ? [seg] : [];
    });

  return { segments: segArr, kind: "contour_candidates" };
};
