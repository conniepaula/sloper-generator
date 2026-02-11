export type Point = {
  x: number;
  y: number;
};

export type Line = {
  from: Point;
  to: Point;
};

export type Vector = {
  x: number;
  y: number;
}

export type Ray = {
  origin: Point;
  direction: Vector;
}


export type CubicBezier = {
  start: Point;
  control1: Point;
  control2: Point;
  end: Point;
};

export type BezierPath = {
  segments: Array<CubicBezier>;
};

type Axis = 'x' | 'y';

export const AxisEnumMap = {
  HORIZONTAL: 'x',
  VERTICAL: 'y'
} as const;

export type CurveControl = {
  axis: Axis;
  tension: number;
};
