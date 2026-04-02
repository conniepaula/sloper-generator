import * as z from "zod";

import type { pdfSize } from "./constants";
import type { exportSchema } from "./schema";

export type PdfSize = keyof typeof pdfSize;

export type ExportSchema = z.infer<typeof exportSchema>;
