/**
 * PDF export sizes in cm.
 */
export const pdfSize = {
  a0: { height: 118.9, width: 84.1 },
  a4: { height: 29.7, width: 21.0 },
  letter: { height: 27.9, width: 21.6 },
} as const;

export const pdfSizePairs = [
  { value: "a0", label: "A0" },
  { value: "a4", label: "A4" },
  { value: "letter", label: "US Letter" },
] as const;
