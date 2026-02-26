import { typedEntries } from "../../core/object";
import type { DraftDocument, DocumentEntities } from "../draft/draft.types";
import type { DraftContextBase } from "./draft.context.types";

export const contextToDraftDocument = <
  TMeasurements,
  TPoints extends string,
  TLine extends string,
  TCurves extends string,
>(
  ctx: DraftContextBase<TMeasurements, TPoints, TLine, TCurves>,
): DraftDocument => {
  const { lines, curves } = ctx;
  const entities: DocumentEntities = { front: [], back: [] };

  typedEntries(lines).forEach(([id, draftLine]) => {
    // only main lines are exportable
    const isExportable = draftLine.role !== "construction";

    entities[draftLine.piece].push({
      id,
      kind: "line",
      exportable: isExportable,
      ...draftLine,
    });
  });

  typedEntries(curves).forEach(([id, draftCurve]) => {
    // all curves are exportable
    entities[draftCurve.piece].push({
      id,
      kind: "curve",
      exportable: true,
      ...draftCurve,
    });
  });

  return { entities };
};
