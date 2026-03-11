import { getBoundingBoxMetrics } from "../../../geometry/helpers";
import { computeBounds, translateEntity } from "../drafting/helpers";
import type { PatternDocument, PatternLayout } from "../drafting/types";

export const composePatternLayout = (
  document: PatternDocument,
  spacing: number,
): PatternLayout => {
  const { front, back } = document.entities;

  // get front bounding box
  const frontBbox = computeBounds(front);
  const frontBboxMetrics = getBoundingBoxMetrics(frontBbox);
  // calculate x offset:
  const xOffset = frontBbox.maxX + spacing;

  // TODO: Work on y offset logic
  const yOffset = 0;

  const translatedBack = back.map((backEntity) =>
    translateEntity(backEntity, xOffset, yOffset),
  );

  // get translatedBack bounding box
  const backBbox = computeBounds(translatedBack);
  const backBboxMetrics = getBoundingBoxMetrics(backBbox);

  // get full layout bounding box
  const layoutEntities = [...front, ...translatedBack];
  const layoutBbox = computeBounds(layoutEntities);
  const layoutBboxMetrics = getBoundingBoxMetrics(layoutBbox);

  return {
    entities: layoutEntities,
    bounds: { ...layoutBbox, ...layoutBboxMetrics },
    perPiece: {
      front: {
        indices: { start: 0, count: front.length },
        bounds: { ...frontBbox, ...frontBboxMetrics },
      },
      back: {
        indices: { start: front.length, count: translatedBack.length },
        bounds: { ...backBbox, ...backBboxMetrics },
      },
    },
  };
};
