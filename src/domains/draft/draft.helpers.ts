import type { Line } from "../../geometry/geometry.types";
import type { DraftLine, Piece, Role, WithoutPiecePrefix } from "./draft.types";

type AddLineOptions = {
  role?: Role;
  name?: string;
};

export const addLine = <
  TDraftContext extends { lines: Record<string, DraftLine> },
  TPiece extends Piece,
>(
  ctx: TDraftContext,
  piece: TPiece,
  id: WithoutPiecePrefix<Extract<keyof TDraftContext["lines"], string>, TPiece>,
  geometry: Line,
  options: AddLineOptions,
) => {
  const { role = "guide", name = "" } = options;

  const specificPieceId = `${piece}_${id}`;
  ctx.lines[specificPieceId] = { geometry, role, piece, name };
};

// TODO: Define addCurve
