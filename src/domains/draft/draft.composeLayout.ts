import { computeBounds, translateEntity } from "./draft.helpers";
import type { DraftDocument, DraftLayout } from "./draft.types";

export const composeDraftLayout = (
  document: DraftDocument,
  spacing: number,
): DraftLayout => {
  const { front, back } = document.entities;

  // get front bounding box
  const frontBoundingBox = computeBounds(front);
  // calculate x offset:
  const xOffset = frontBoundingBox.maxX + spacing;

  // TODO: Work on y offset logic
  const yOffset = 0;

  const translatedBack = back.map((backEntity) =>
    translateEntity(backEntity, xOffset, yOffset),
  );

  // get translatedBack bounding box
  const backBoundingBox = computeBounds(translatedBack);

  // get full layout bounding box
  const layoutEntities = [...front, ...translatedBack];
  const layoutBoundingBox = computeBounds(layoutEntities);

  return {
    entities: layoutEntities,
    bounds: layoutBoundingBox,
    perPiece: {
      front: {
        indices: { start: 0, count: front.length },
        bounds: frontBoundingBox,
      },
      back: {
        indices: { start: front.length, count: translatedBack.length },
        bounds: backBoundingBox,
      },
    },
  };
};
