import type {
  BoundingBox,
  BoundingBoxMetrics,
  CubicBezier,
  Line,
  // Point
} from "../../../geometry/types";

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

interface EntityOps {
  id: string;
  exportable: boolean;
}

export interface LineEntity extends PatternLine, EntityOps {
  kind: "line";
}

export interface CurveEntity extends PatternCurve, EntityOps {
  kind: "curve";
}

// export type PatternText = {
//   id: string;
//   kind: "text";
//   position: Point;
//   value: string;
// };

export type Entity = LineEntity | CurveEntity;

export type Entities = Array<Entity>;

export type DocumentEntities = Record<Piece, Entities>;

export type PatternDocument = { entities: DocumentEntities };

export type Bounds = BoundingBox & BoundingBoxMetrics;

type PerPieceProps = {
  indices: { start: number; count: number };
  bounds: Bounds;
};

export interface PatternLayout {
  entities: Array<Entity>;
  bounds: Bounds;
  perPiece: Record<Piece, PerPieceProps>;
}

export type WithoutPiecePrefix<
  T extends string,
  TPrefix extends Piece,
> = T extends `${TPrefix}_${infer K}` ? K : never;
