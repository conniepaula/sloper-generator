import { DomainError } from "../../errors";
import { lineLength } from "../../../geometry/helpers";
import type { CubicBezier, Line } from "../../../geometry/types";
import type {
  PatternCurve,
  PatternLine,
  Piece,
  Role,
  Seam,
  WithoutPiecePrefix,
} from "./types";
import type { SloperType } from "../../slopers/registry";
import type { AnnotationBase, PatternAnnotation } from "./annotations/types";

// TODO: Once anchor points can be altered, separate line and curve options
type AddOptions = {
  role?: Role;
  name?: string;
};

/**
 * Adds a `PatternLine` to the pattern context.
 *
 * The line is stored under a piece-prefixed id (e.g. "front_centerFront").
 * Metadata such as role and name are attached for later rendering/export.
 *
 * @param options - Optional metadata. Default values:  {role: "guide", name: ""}
 */
export const addLine = <
  TPatternContext extends { lines: Record<string, PatternLine> },
  TPiece extends Piece,
>(
  ctx: TPatternContext,
  piece: TPiece,
  id: WithoutPiecePrefix<
    Extract<keyof TPatternContext["lines"], string>,
    TPiece
  >,
  geometry: Line,
  options: AddOptions,
) => {
  const { role = "guide", name = "" } = options;

  const specificPieceId = `${piece}_${id}`;
  ctx.lines[specificPieceId] = { geometry, role, piece, name };
};

/**
 * Adds a `PatternCurve` to the pattern context.
 *
 * The curve is stored under a piece-prefixed id (e.g. "back_armhole").
 * Metadata such as role and name are attached for later rendering/export.
 *
 * @param options - Optional metadata. Default values:  {role: "guide", name: ""}
 */
export const addCurve = <
  TPatternContext extends { curves: Record<string, PatternCurve> },
  TPiece extends Piece,
>(
  ctx: TPatternContext,
  piece: TPiece,
  id: WithoutPiecePrefix<
    Extract<keyof TPatternContext["curves"], string>,
    TPiece
  >,
  geometry: CubicBezier,
  options: AddOptions,
) => {
  const { role = "guide", name = "" } = options;

  const specificPieceId = `${piece}_${id}`;
  ctx.curves[specificPieceId] = { geometry, role, piece, name };
};

export const addAnnotation = <
  TPatternContext extends {
    annotations: Record<string, PatternAnnotation>;
  },
  TPiece extends Piece,
>(
  ctx: TPatternContext,
  piece: TPiece,
  id: WithoutPiecePrefix<
    Extract<keyof TPatternContext["annotations"], string>,
    TPiece
  >,
  annotation: AnnotationBase,
) => {
  const specificPieceId = `${piece}_${id}`;
  ctx.annotations[specificPieceId] = { ...annotation, piece };
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
  sloper: SloperType;
  diff?: number;
  errorMessage?: string;
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
export const walkSeams = (seam1: Seam, seam2: Seam, opts: WalkSeamsOpts) => {
  const {
    sloper,
    diff = 0.3,
    errorMessage = "Seam lengths too different. Check your measurements",
    details = "",
  } = opts;
  const seam1Length = getSeamLength(seam1);
  const seam2Length = getSeamLength(seam2);

  const seamDiff = Math.abs(seam2Length - seam1Length);

  if (seamDiff > diff) {
    throw new DomainError(errorMessage, { sloper, details, stage: "drafting" });
  }
};
