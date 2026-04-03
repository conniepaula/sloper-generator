import type { Point } from "../../geometry/types";

export const ORIGIN = { x: 0, y: 0 } as const satisfies Point;

export const ADDED_ARMSCYE_DEPTH = 0.5;

export const FRONT_WAIST_DART_DEPTH = 3;

export const BACK_WAIST_DART_DEPTH = 2;

export const BUST_DART_HORIZONTAL_SHIFT = 3; // Usually 3cm for smaller sizes, 4cm for larger
