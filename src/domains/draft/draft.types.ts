import type { CubicBezier, Line, Point } from "../../geometry/geometry.types";

export type DraftDocument = {
  entities: Array<DraftEntity>;
};

export type DraftEntity = DraftLine | DraftCurve;

export type DraftLine = {
  id: string;
  kind: "line";
  geometry: Line;
  role: "main" | "aux";
  name?: string;
};

export type DraftCurve = {
  id: string;
  kind: "curve";
  geometry: CubicBezier;
  role: "main" | "aux";
  name?: string;
};

// export type DraftText = {
//   id: string;
//   kind: "text";
//   position: Point;
//   value: string;
// };
