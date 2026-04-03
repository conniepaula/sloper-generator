import type { PatternDocument, DocumentEntities } from "./types";
import type { PatternDraftingContextBase } from "./context.types";
import { typedEntries } from "../../../shared/utils/collections";
import type { DocumentAnnotations } from "./annotations/types";

export const contextToPatternModel = <
  TMeasurements,
  TPoints extends string,
  TLine extends string,
  TCurves extends string,
  TAnnotations extends string,
>(
  ctx: PatternDraftingContextBase<
    TMeasurements,
    TPoints,
    TLine,
    TCurves,
    TAnnotations
  >,
): PatternDocument => {
  const { lines, curves, annotations: patternAnnotations } = ctx;
  const entities: DocumentEntities = { front: [], back: [] };
  const annotations: DocumentAnnotations = { front: [], back: [] };

  typedEntries(lines).forEach(([id, patternLine]) => {
    // only main lines are exportable
    const isExportable = patternLine.role !== "construction";

    entities[patternLine.piece].push({
      id,
      kind: "line",
      exportable: isExportable,
      ...patternLine,
    });
  });

  typedEntries(curves).forEach(([id, patternCurve]) => {
    // all curves are exportable
    entities[patternCurve.piece].push({
      id,
      kind: "curve",
      exportable: true,
      ...patternCurve,
    });
  });

  typedEntries(patternAnnotations).forEach(([id, patternAnnotation]) => {
    annotations[patternAnnotation.piece].push({
      id,
      ...patternAnnotation,
    });
  });

  return { entities, annotations };
};
