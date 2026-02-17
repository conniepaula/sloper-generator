import type { DraftDocument, DraftEntity } from "../draft/draft.types";
import type { BodiceDraftContext } from "./bodice.context.types";

export const bodiceContextToDraftDocument = (
  ctx: BodiceDraftContext,
): DraftDocument => {
  const { lines, curves } = ctx;
  const entities: Array<DraftEntity> = [];

  Object.entries(lines).forEach(([id, draftLine]) => {
    // only main lines are exportable
    const isExportable = draftLine.role !== "construction";

    entities.push({ id, kind: "line", exportable: isExportable, ...draftLine });
  });

  Object.entries(curves).forEach(([id, draftCurve]) => {
    // all curves are exportable
    entities.push({ id, kind: "curve", exportable: true, ...draftCurve });
  });

  return { entities };
};
