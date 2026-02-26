import type {
  BoundingBox,
  CubicBezier,
  Line,
  // Point
} from "../../geometry/geometry.types";

export type Piece = "front" | "back";
export type Role = "main_outer" | "main_inner" | "guide" | "construction";
export type Seam = Line | Array<Line>;

interface DraftGeometryWrapper {
  role: Role;
  piece: Piece;
  name: string;
}

export interface DraftLine extends DraftGeometryWrapper {
  geometry: Line;
}

export interface DraftCurve extends DraftGeometryWrapper {
  geometry: CubicBezier;
}

interface LineEntity extends DraftLine {
  kind: "line";
}

interface CurveEntity extends DraftCurve {
  kind: "curve";
}

// export type DraftText = {
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

export type DraftDocument = { entities: DocumentEntities };

type PerPieceProps = {
  indices: { start: number; count: number };
  bounds: BoundingBox;
};

export interface DraftLayout {
  entities: Array<Entity>;
  bounds: BoundingBox;
  perPiece: Record<Piece, PerPieceProps>;
}

export type WithoutPiecePrefix<
  T extends string,
  TPrefix extends Piece,
> = T extends `${TPrefix}_${infer K}` ? K : never;
