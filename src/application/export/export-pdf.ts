import { jsPDF } from "jspdf";
import "svg2pdf.js";

import { pdfSize, type PdfSize } from "./constants";
import { cloneSvg } from "./clone-svg";
import type { Bounds } from "../../core/pattern/drafting/types";

interface ExportPdfOpts {
  size?: PdfSize;
  fileName?: string;
}

export const exportPdf = async (
  svg: SVGSVGElement,
  bounds: Bounds,
  opts: ExportPdfOpts = {},
) => {
  const { size = "A0", fileName = "exported_pattern" } = opts;
  const width = pdfSize[size].width;
  const height = pdfSize[size].height;
  const pdf = new jsPDF(width > height ? "l" : "p", "cm", [width, height]);

  const clone = cloneSvg(
    svg,
    bounds.height,
    bounds.width,
    bounds.minX,
    bounds.minY,
  );

  await pdf.svg(clone, { x: 2, y: 2 });

  const blob = pdf.output("blob");

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
    pdf.save(`${fileName}.pdf`);
  }
};
