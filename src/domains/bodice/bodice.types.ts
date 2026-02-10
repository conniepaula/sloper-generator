import type { Point } from "../../geometry/geometry.types";

export type CircumferenceMeasurements = {
  bust: number; // measure at most voluminous part of bust
  waist: number; // measure below ribs, slightly above belly button (women)
};

export type VerticalMeasurements = {
  frontWaistHeight: number; // measure from the middle of the shoulder over the bust apex to the waistline
  backWaistHeight: number; // measure from the middle of the shoulder to the waistline at the back
  bustHeight: number; // measure from the middle of the shoulder to the bust apex
  centerFrontHeight: number; // measure from the waistline to the center front of the neck (where the collar would sit)
  centerBackHeight: number; // measure from the waistline to the center back of the neck (where the collar would sit)
  shoulderSlope: number; // usually between 3.5cm and 5cm
};

export type HorizontalMeasurements = {
  bustSpan: number; // measure from one bust apex to the other
  shoulderLength: number; // measure from the neck to the shoulder point
  frontShoulderSpan: number; // measure from one shoulder point to the other at the front
  backShoulderSpan: number; // measure from one shoulder point to the other at the back (through cervical point)
  bustFront: number; // measure from one side of the body to the other through the bust apex
  frontArmscyeToArmscye: number; // measure from one armscye point to the other through the front (above the bust)
  backArmscyeToArmscye: number; // measure from one armscye point to the other through the back
};

export type BodiceMeasurements = CircumferenceMeasurements &
  VerticalMeasurements &
  HorizontalMeasurements;


export type BasePoints = {
  cfNeckline: Point;
  cfWaistline: Point;
};

export type PrimaryPoints = {
  cfArmscye: Point;
  cfBust: Point;
  lShoulder: Point;
  sWaist: Point;
  necklineStart: Point;
  shoulderStart: Point;
};

export type SecondaryPoints = {
  lShoulderSlope: Point;
  sArmscye: Point;
  sBust: Point;
  armscyeStart: Point;
};

export type TertiaryPoints = {
  armholeMidPoint: Point;
};

export type QuaternaryPoints = {
  armholeDepth: Point;
}
