import { assertNonEmpty } from "../../core/assert";
import { DomainError, type DomainName } from "../../core/errors";
import {
  getBoundingBoxFromLines,
  lineLength,
  translateCurve,
  translateLine,
} from "../../geometry/geometry.helpers";
import type { CubicBezier, Line } from "../../geometry/geometry.types";
import type {
  DraftCurve,
  Entity,
  DraftLine,
  Piece,
  Role,
  Seam,
  WithoutPiecePrefix,
} from "./draft.types";

// TODO: Once aanchor points can be altered, separate line and curve options
type AddOptions = {
  role?: Role;
  name?: string;
};

/**
 * Adds a `DraftLine` to the draft context.
 *
 * The line is stored under a piece-prefixed id (e.g. "front_centerFront").
 * Metadata such as role and name are attached for later rendering/export.
 *
 * @param options - Optional metadata. Default values:  {role: "guide", name: ""}
 */
export const addLine = <
  TDraftContext extends { lines: Record<string, DraftLine> },
  TPiece extends Piece,
>(
  ctx: TDraftContext,
  piece: TPiece,
  id: WithoutPiecePrefix<Extract<keyof TDraftContext["lines"], string>, TPiece>,
  geometry: Line,
  options: AddOptions,
) => {
  const { role = "guide", name = "" } = options;

  const specificPieceId = `${piece}_${id}`;
  ctx.lines[specificPieceId] = { geometry, role, piece, name };
};

/**
 * Adds a cubic bezier curve to the draft context.
 *
 * The curve is stored under a piece-prefixed id (e.g. "back_armhole").
 * Metadata such as role and name are attached for later rendering/export.
 *
 * @param options - Optional metadata. Default values:  {role: "guide", name: ""}
 */
export const addCurve = <
  TDraftContext extends { curves: Record<string, DraftCurve> },
  TPiece extends Piece,
>(
  ctx: TDraftContext,
  piece: TPiece,
  id: WithoutPiecePrefix<
    Extract<keyof TDraftContext["curves"], string>,
    TPiece
  >,
  geometry: CubicBezier,
  options: AddOptions,
) => {
  const { role = "guide", name = "" } = options;

  const specificPieceId = `${piece}_${id}`;
  ctx.curves[specificPieceId] = { geometry, role, piece, name };
};

/** Extracts line geometries from a collection of draft entities.
 *
 * @param entities Array of draft entities (lines and curves).
 * @returns Array of Line geometries, excluding curves.
 */
export const extractLines = (entities: Array<Entity>): Array<Line> => {
  return entities.filter((e) => e.kind === "line").map((e) => e.geometry);
};

/**
 * Extracts exportable line geometries from a collection of draft entities.
 *
 * Only includes lines that have the `exportable` property set to true.
 *
 * @param entities Array of draft entities (lines and curves).
 * @returns Array of Line geometries marked as exportable.
 */
export const extractExportableLines = (entities: Array<Entity>): Line[] => {
  return entities
    .filter(
      (entity): entity is Extract<Entity, { kind: "line" }> =>
        entity.exportable && entity.kind === "line",
    )
    .map((entity) => entity.geometry);
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

/**
 * Translates a draft entity (line or curve) by given distances.
 *
 * Preserves all metadata (role, piece, name, etc.) while updating
 * the geometric coordinates.
 *
 * @param entity The draft entity to translate.
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
 * Calculates the sum of the length of all the lines in a line array.
 */
export const getLineArrayLength = (lineArray: Array<Line>): number => {
  if (lineArray.length === 0) {
    return 0;
  }

  let lineArrayLength = 0;

  lineArray.map((line) => {
    lineArrayLength += lineLength(line);
  });

  return lineArrayLength;
};

/**
 * Calculates the length of a single or segmented seam.
 *
 * @param seam Line or line array
 */
export const getSeamLength = (seam: Seam) => {
  const isSeamArray = Array.isArray(seam);
  let seamLength = 0;
  if (isSeamArray) {
    seamLength = getLineArrayLength(seam);
  } else {
    seamLength = lineLength(seam);
  }

  return seamLength;
};

interface WalkSeamsOpts {
  diff?: number;
  errorMessage?: string;
  domain?: DomainName;
  details?: string;
}

/**
 * Walks seams to ensure pattern correctness.
 *
 * When sewing one seam to another, they must be the same length. Checking this is called 'walking seams',
 * hence the name of the function.
 *
 * @param seam1 Seam
 * @param seam2 Seam
 * @param opts Optional parameter. Defaults to diff = 0.3, domain = "draft".
 * @returns A new entity with translated geometry.
 */
export const walkSeams = (
  seam1: Seam,
  seam2: Seam,
  opts: WalkSeamsOpts = {},
) => {
  const {
    diff = 0.3,
    errorMessage = "Seam lengths too different. Check your measurements",
    domain = "draft",
    details = "",
  } = opts;
  const seam1Length = getSeamLength(seam1);
  const seam2Length = getSeamLength(seam2);

  const seamDiff = Math.abs(seam2Length - seam1Length);

  if (seamDiff > diff) {
    throw new DomainError(errorMessage, domain, details);
  }
};
