import type {
  CubicBezier,
  Line,
  // Point
} from "../../geometry/geometry.types";

export type Piece = "front" | "back";
export type Role = "main_outer" | "main_inner" | "guide" | "construction";

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

export type DraftEntity = {
  id: string;
  exportable: boolean;
} & (LineEntity | CurveEntity);

export type RawEntities = Record<Piece, Array<DraftEntity>>;

export type RawDraft = { rawEntities: RawEntities };

export type DraftDocument = {
  entities: Array<DraftEntity>;
};

export type WithoutPiecePrefix<
  T extends string,
  TPrefix extends Piece,
> = T extends `${TPrefix}_${infer K}` ? K : never;
