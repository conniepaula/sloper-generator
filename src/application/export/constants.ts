/**
 * PDF export sizes in cm.
 */
export const pdfSize = {
  A0: { height: 118.9, width: 84.1 },
};

export type PdfSize = keyof typeof pdfSize;
