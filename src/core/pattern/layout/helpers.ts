import {
  getBoundingBoxFromLines,
  translateCurve,
  translateLine,
  translatePoint,
} from "../../../geometry/helpers";
import type { Line } from "../../../geometry/types";
import { assertNonEmpty } from "../../../shared/utils/assert";
import type { Annotation } from "../drafting/annotations/types";
import type { Entity } from "../drafting/types";

/** Extracts line geometries from a collection of pattern entities.
 *
 * @param entities Array of pattern entities (lines and curves).
 * @returns Array of Line geometries, excluding curves.
 */
export const extractLines = (entities: Array<Entity>): Array<Line> => {
  return entities.filter((e) => e.kind === "line").map((e) => e.geometry);
};

/**
 * Extracts exportable line geometries from a collection of pattern entities.
 *
 * Only includes lines that have the `exportable` property set to true.
 *
 * @param entities Array of pattern entities (lines and curves).
 * @returns Array of Line geometries marked as exportable.
 */
export const extractExportableLines = (
  entities: Array<Entity>,
): Array<Line> => {
  return entities
    .filter(
      (entity): entity is Extract<Entity, { kind: "line" }> =>
        entity.exportable && entity.kind === "line",
    )
    .map((entity) => entity.geometry);
};

/**
 * Translates a pattern entity (line or curve) by given distances.
 *
 * Preserves all metadata (role, piece, name, etc.) while updating
 * the geometric coordinates.
 *
 * @param entity The pattern entity to translate.
 * @param dx The horizontal translation distance (default: 0).
 * @param dy The vertical translation distance (default: 0).
 * @returns A new entity with translated geometry.
 */
export const translateEntity = (
  entity: Entity,
  dx: number = 0,
  dy: number = 0,
): Entity => {
  if (entity.kind === "line") {
    return { ...entity, geometry: translateLine(entity.geometry, dx, dy) };
  }
  // entity is curve
  return { ...entity, geometry: translateCurve(entity.geometry, dx, dy) };
};

/**
 * Computes bounds for an array of entities.
 *
 * Currently, it only takes exportable lines into account.
 */
export const computeBounds = (entities: Array<Entity>) => {
  // get lines from all entities
  const lines = extractExportableLines(entities);

  assertNonEmpty(
    lines,
    "Invariant violated: entities array has no exportable lines.",
  );

  return getBoundingBoxFromLines(lines);
};

export const translateAnnotation = (
  annotation: Annotation,
  dx: number = 0,
  dy: number = 0,
): Annotation => {
  const { shape, type } = annotation;
  switch (type) {
    case "cut_on_fold":
      return {
        ...annotation,
        shape: {
          ...shape,
          startPoint: translatePoint(shape.startPoint, dx, dy),
        },
      };
    default:
      // TODO: Add cases as annotation types are added
      return annotation;
  }
};
