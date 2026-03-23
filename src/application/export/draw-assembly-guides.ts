import type { jsPDF } from "jspdf";

export const drawAssemblyGuides = (
  doc: jsPDF,
  margin: number,
  pageWidth: number,
  pageHeight: number,
) => {
  doc.setLineWidth(0.02); // cm
  doc.setDrawColor(0, 0, 0); // black
  doc.setLineCap("butt");

  const top = margin;
  const bottom = pageHeight - margin;
  const left = margin;
  const right = pageWidth - margin;

  doc.rect(left, top, pageWidth - 2 * margin, pageHeight - 2 * margin);

  const midX = pageWidth / 2;
  const midY = pageHeight / 2;
  const base = 0.5;
  const h = base / 2;

  // left and right triangles
  doc.triangle(left, midY - h, left + h, midY, left, midY + h, "F");
  doc.triangle(right, midY - h, right - h, midY, right, midY + h, "F");
  // top and bottom triangles
  doc.triangle(midX - h, top, midX, top + h, midX + h, top, "F");
  doc.triangle(midX - h, bottom, midX, bottom - h, midX + h, bottom, "F");
};
