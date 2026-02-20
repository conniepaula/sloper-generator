import { assertNonEmpty } from "../../core/assert";
import { getBoundingBoxFromLines } from "../../geometry/geometry.helpers";
import { extractExportableLines, translateEntity } from "./draft.helpers";
import type { ComposedDraftLayout, RawDraft } from "./draft.types";

export const composeDraftLayout = (
  rawDraft: RawDraft,
  spacing: number = 3,
): ComposedDraftLayout => {
  const { front, back } = rawDraft.rawEntities;

  // calculate x offset:
  const frontLines = extractExportableLines(front);

  assertNonEmpty(
    frontLines,
    "Invariant violated: front has no exportable lines.",
  );

  const frontBoundingBox = getBoundingBoxFromLines(frontLines);
  const xOffset = frontBoundingBox.maxX + spacing;

  // TODO: Work on y offset logic
  const yOffset = 0;

  const translatedBack = back.map((backEntity) =>
    translateEntity(backEntity, xOffset, yOffset),
  );

  return { entities: [...front, ...translatedBack] };
};
