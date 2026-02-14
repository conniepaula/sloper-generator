import type { DraftDocument, DraftEntity } from "../draft/draft.types";
import type { BodiceDraftContext } from "./bodice.context.types";

export const bodiceContextToDraftDocument = (
  ctx: BodiceDraftContext,
): DraftDocument => {
  const { lines, curves } = ctx;
  const entities: Array<DraftEntity> = [];

  Object.entries(lines).forEach(([id, geometry]) => {
    // TODO: Add roles other than main for lines
    entities.push({ id, kind: "line", geometry, role: "main" });
  });

  Object.entries(curves).forEach(([id, geometry]) => {
    entities.push({ id, kind: "curve", geometry, role: "main" });
  });

  return { entities };
};
