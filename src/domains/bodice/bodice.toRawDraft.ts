import type { RawDraft, RawEntities } from "../draft/draft.types";
import type { BodiceDraftContext } from "./bodice.context.types";

export const bodiceContextToRawDraft = (ctx: BodiceDraftContext): RawDraft => {
  const { lines, curves } = ctx;
  const rawEntities: RawEntities = { front: [], back: [] };

  Object.entries(lines).forEach(([id, draftLine]) => {
    // only main lines are exportable
    const isExportable = draftLine.role !== "construction";

    rawEntities[draftLine.piece].push({
      id,
      kind: "line",
      exportable: isExportable,
      ...draftLine,
    });
  });

  Object.entries(curves).forEach(([id, draftCurve]) => {
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
