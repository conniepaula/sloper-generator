import { translateCurve, translateLine } from "../../geometry/geometry.helpers";
import type { CubicBezier, Line } from "../../geometry/geometry.types";
import type {
  DraftCurve,
  DraftEntity,
  DraftLine,
  Piece,
  Role,
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
export const extractLines = (entities: Array<DraftEntity>): Array<Line> => {
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
export const extractExportableLines = (
  entities: Array<DraftEntity>,
): Line[] => {
  return entities
    .filter(
      (entity): entity is Extract<DraftEntity, { kind: "line" }> =>
        entity.exportable && entity.kind === "line",
    )
    .map((entity) => entity.geometry);
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
  entity: DraftEntity,
  dx: number = 0,
  dy: number = 0,
): DraftEntity => {
  if (entity.kind === "line") {
    return { ...entity, geometry: translateLine(entity.geometry, dx, dy) };
  }
  // entity is curve
  return { ...entity, geometry: translateCurve(entity.geometry, dx, dy) };
};
