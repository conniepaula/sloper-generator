import { jsPDF } from "jspdf";
import "svg2pdf.js";

import { pdfSize, type PdfSize } from "./constants";
import { cloneSvg } from "./clone-svg";
import type { Bounds } from "../../core/pattern/drafting/types";
import { drawAssemblyGuides } from "./draw-assembly-guides";
import { drawPageNumber } from "./draw-page-number";

interface ExportPdfOpts {
  size?: PdfSize;
  fileName?: string;
}

export const exportPdf = async (
  svg: SVGSVGElement,
  bounds: Bounds,
  opts: ExportPdfOpts = {},
) => {
  const { size = "a0", fileName = "exported_pattern" } = opts;
  const pageWidth = pdfSize[size].width;
  const pageHeight = pdfSize[size].height;
  const orientation = pageWidth > pageHeight ? "landscape" : "portrait";
  const margin = 1; // cm

  const printableWidth = pageWidth - 2 * margin;
  const printableHeight = pageHeight - 2 * margin;

  const unitsPerCm = 1;

  const doc = new jsPDF({
    orientation,
    unit: "cm",
    format: size,
  });

  const clone = cloneSvg(
    svg,
    bounds.height,
    bounds.width,
    bounds.minX,
    bounds.minY,
  );

  const viewBox = clone.viewBox.baseVal;
  const svgWidthUnits = viewBox.width;
  const svgHeightUnits = viewBox.height;

  const renderWidth = svgWidthUnits / unitsPerCm;
  const renderHeight = svgHeightUnits / unitsPerCm;

  const cols = Math.ceil(renderWidth / printableWidth);
  const rows = Math.ceil(renderHeight / printableHeight);

  let firstPage = true;
  let pageCount = 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!firstPage) {
        doc.addPage(size, orientation);
      }
      firstPage = false;

      const x = margin - col * printableWidth;
      const y = margin - row * printableHeight;

      doc.saveGraphicsState();
      doc.rect(margin, margin, printableWidth, printableHeight, null);
      doc.clip();
      doc.discardPath();

      pageCount++;

      await doc.svg(clone, {
        x,
        y,
        width: renderWidth,
        height: renderHeight,
      });

      doc.restoreGraphicsState();

      if (size === "a4") {
        drawPageNumber(doc, pageWidth, pageHeight, pageCount);
        drawAssemblyGuides(doc, margin, pageWidth, pageHeight);
      }
    }
  }

  const blob = doc.output("blob");

  if ("showSaveFilePicker" in window) {
    const handle = await window.showSaveFilePicker({
      suggestedName: `${fileName}.pdf`,
      types: [
        {
          description: "PDF file",
          accept: { "application/pdf": [".pdf"] },
        },
      ],
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  } else {
    doc.save(`${fileName}.pdf`);
  }
};
