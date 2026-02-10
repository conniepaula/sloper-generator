export type Point = {
  x: number;
  y: number;
};

export type Line = {
  from: Point;
  to: Point;
};

export type CubicBezier = {
  start: Point;
  control1: Point;
  control2: Point;
  end: Point;
};
