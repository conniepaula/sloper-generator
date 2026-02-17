import type { CubicBezier, Line } from "../../geometry/geometry.types";
import type {
  DraftCurve,
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
