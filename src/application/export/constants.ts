/**
 * PDF export sizes in cm.
 */
export const pdfSize = {
  a0: { height: 118.9, width: 84.1 },
  a4: { height: 29.7, width: 21.0 },
  letter: { height: 27.9, width: 21.6 },
};

export type PdfSize = keyof typeof pdfSize;
