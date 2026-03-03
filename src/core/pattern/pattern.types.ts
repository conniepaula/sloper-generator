import type {
  BoundingBox,
  CubicBezier,
  Line,
  // Point
} from "../../geometry/geometry.types";

export type Piece = "front" | "back";
export type Role = "main_outer" | "main_inner" | "guide" | "construction";
export type Seam = Line | Array<Line>;

interface GeometryWrapper {
  role: Role;
  piece: Piece;
  name: string;
}

export interface PatternLine extends GeometryWrapper {
  geometry: Line;
}

export interface PatternCurve extends GeometryWrapper {
  geometry: CubicBezier;
}

interface LineEntity extends PatternLine {
  kind: "line";
}

interface CurveEntity extends PatternCurve {
  kind: "curve";
}

// export type PatternText = {
//   id: string;
//   kind: "text";
//   position: Point;
//   value: string;
// };

export type Entity = {
  id: string;
  exportable: boolean;
} & (LineEntity | CurveEntity);

export type DocumentEntities = Record<Piece, Array<Entity>>;

export type PatternDocument = { entities: DocumentEntities };

type PerPieceProps = {
  indices: { start: number; count: number };
  bounds: BoundingBox;
};

export interface PatternLayout {
  entities: Array<Entity>;
  bounds: BoundingBox;
  perPiece: Record<Piece, PerPieceProps>;
}

export type WithoutPiecePrefix<
  T extends string,
  TPrefix extends Piece,
> = T extends `${TPrefix}_${infer K}` ? K : never;
