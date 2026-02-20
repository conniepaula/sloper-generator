import { typedEntries } from "../../core/object";
import type { RawDraft, RawEntities } from "../draft/draft.types";
import type { DraftContextBase } from "./draft.context.types";

export const contextToRawDraft = <
  TMeasurements,
  TPoints extends string,
  TLine extends string,
  TCurves extends string,
>(
  ctx: DraftContextBase<TMeasurements, TPoints, TLine, TCurves>,
): RawDraft => {
  const { lines, curves } = ctx;
  const rawEntities: RawEntities = { front: [], back: [] };

  typedEntries(lines).forEach(([id, draftLine]) => {
    // only main lines are exportable
    const isExportable = draftLine.role !== "construction";

    rawEntities[draftLine.piece].push({
      id,
      kind: "line",
      exportable: isExportable,
      ...draftLine,
    });
  });

  typedEntries(curves).forEach(([id, draftCurve]) => {
    // all curves are exportable
    rawEntities[draftCurve.piece].push({
      id,
      kind: "curve",
      exportable: true,
      ...draftCurve,
    });
  });

  return { rawEntities };
};
