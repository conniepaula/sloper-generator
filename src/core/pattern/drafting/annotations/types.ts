import type { Axis, Line, Point } from "../../../../geometry/types";
import type { Piece } from "../types";

export interface AnnotationShapeMap {
  cut_on_fold: FoldLine;
  // cut_on_fold: Array<FoldLine>;
  text: PatternText;
  grainLine: Line;
  // notch: Line
  // button_placement: Line
}

export type AnnotationType = keyof AnnotationShapeMap;

export type AnnotationTextType = "title" | "subtitle" | "label";

interface ShapeBase {
  id: string;
}

// interface FoldLine extends ShapeBase {
//   geometry: Line;
//   axis: Axis;
// }

interface FoldLine {
  startPoint: Point;
  width: number;
  height: number;
}

interface PatternText extends ShapeBase {
  type: AnnotationTextType;
  value: string;
  position: { x: number; y: number };
}

export type AnnotationBase = {
  [P in AnnotationType]: {
    type: P;
    shape: AnnotationShapeMap[P];
  };
}[AnnotationType];

export type PatternAnnotation = {
  [P in AnnotationType]: {
    type: P;
    shape: AnnotationShapeMap[P];
    piece: Piece;
  };
}[AnnotationType];

export type Annotation = {
  [P in AnnotationType]: {
    id: string;
    type: P;
    shape: AnnotationShapeMap[P];
  };
}[AnnotationType];

export type Annotations = Array<Annotation>;

export type DocumentAnnotations = Record<Piece, Annotations>;

// interface FoldAnnotation extends AnnotationWrapper {
//   type: "cut_on_fold";
//   shape: Array<FoldLine>;
// }

// interface TextAnnotation extends AnnotationWrapper {
//   type: "text";
//   shape: PatternText;
// }

// export interface PatternAnnotation<
//   T extends AnnotationType,
// > extends AnnotationWrapper {
//   type: T;
//   shape: AnnotationShapeMap[T];
// }

// export interface Annotation<T extends AnnotationType> extends Omit<
//   PatternAnnotation<T>,
//   "piece"
// > {
//   id: string;
// }

// type Annotation = {
//   [P in AnnotationType]: {
//     id: string;
//     type: P;
//     shape: AnnotationShapeMap[P];
//   };
//   }[AnnotationType];

// export interface Annotation extends Omit<PatternAnnotation, "piece"> {
//   id: string;
// }
