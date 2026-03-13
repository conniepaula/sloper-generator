import * as z from "zod";

const measurement = z.coerce
  .number<string>("Error: Input must be a positive number.")
  .positive("Error: Input must be a positive number.");

// WHOLE BODY MEASUREMENTS
// TODO: Add more measurements as new sloper types are added

export const measurementsSchema = z.object({
  // ── Circumference ─────────────────────────────
  bust: measurement.meta({
    title: "Bust",
    description: "Measure at most voluminous part of bust",
  }),

  waist: measurement.meta({
    title: "Waist",
    description: "Measure below ribs, slightly above belly button",
  }),

  // ── Vertical ──────────────────────────────────
  frontWaistHeight: measurement.meta({
    title: "Front Waist Height",
    description:
      "Measure from the middle of the shoulder over the bust apex to the waistline",
  }),

  backWaistHeight: measurement.meta({
    title: "Back Waist Height",
    description:
      "Measure from the middle of the shoulder to the waistline at the back",
  }),

  bustHeight: measurement.meta({
    title: "Bust Height",
    description: "Measure from the middle of the shoulder to the bust apex",
  }),

  centerFrontHeight: measurement.meta({
    title: "Center Front Height",
    description:
      "Measure from the waistline to the center front of the neck (where the collar would sit)",
  }),

  centerBackHeight: measurement.meta({
    title: "Center Back Height",
    description:
      "Measure from the waistline to the center back of the neck (where the collar would sit)",
  }),

  shoulderSlope: measurement.meta({
    title: "Shoulder Slope",
    description: "Usually between 3.5cm and 5cm",
  }),

  // ── Horizontal ────────────────────────────────
  apexToApex: measurement.meta({
    title: "Bust apex to apex",
    description: "Measure from one bust apex to the other",
  }),

  shoulderLength: measurement.meta({
    title: "Shoulder length",
    description:
      "Measure from the neck to the shoulder point (where you feel the bones connect)",
  }),

  frontShoulderSpan: measurement.meta({
    title: "Front Shoulder Span",
    description: "Measure from one shoulder point to the other at the front",
  }),

  backShoulderSpan: measurement.meta({
    title: "Back Shoulder Span",
    description:
      "Measure from one shoulder point to the other at the back (through cervical point)",
  }),

  bustFront: measurement.meta({
    title: "Front Bust",
    description:
      "Measure from one side of the body to the other through the bust apex",
  }),

  frontArmscyeToArmscye: measurement.meta({
    title: "Front Armscye to Armscye",
    description:
      "Measure from one armscye point to the other through the front (above the bust)",
  }),

  backArmscyeToArmscye: measurement.meta({
    title: "Back Armscye to Armscye",
    description: "Measure from one armscye point to the other through the back",
  }),
});

export type MeasurementKeys = keyof z.infer<typeof measurementsSchema>;

export type MeasurementMask = { [K in MeasurementKeys]?: true };
