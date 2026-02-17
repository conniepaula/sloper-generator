import type {
  CubicBezier,
  Line,
  // Point
} from "../../geometry/geometry.types";

export type Piece = "front" | "back";
export type Role = "main" | "guide";

export type DraftDocument = {
  entities: Array<DraftEntity>;
};

export type DraftEntity = DraftLine | DraftCurve;

export type DraftLine = {
  id: string;
  kind: "line";
  geometry: Line;
  role: Role;
  piece: Piece;
  name: string;
};

export type DraftCurve = {
  id: string;
  kind: "curve";
  geometry: CubicBezier;
  role: Role;
  piece: Piece;
  name: string;
};

export type Draft<T extends DraftEntity> = {
  id: string;
  geometry: T;
  kind: T extends CubicBezier ? "curve" : "line";
  role: Role;
  piece: Piece;
  name: string;
};

// export type DraftText = {
//   id: string;
//   kind: "text";
//   position: Point;
//   value: string;
// };
