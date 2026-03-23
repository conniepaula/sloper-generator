import type { jsPDF } from "jspdf";

export const drawPageNumber = (
  doc: jsPDF,
  pageWidth: number,
  pageHeight: number,
  pageNumber: number,
) => {
  doc.saveGraphicsState();

  doc.setFontSize(120);
  doc.setTextColor(200, 200, 200);

  doc.text(`${pageNumber}`, pageWidth / 2, pageHeight / 2, {
    align: "center",
    baseline: "middle",
  });

  doc.restoreGraphicsState();
};
