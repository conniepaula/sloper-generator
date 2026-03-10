import { partition } from "../../../shared/utils/collections";
import type { Entities, PatternDocument } from "../drafting/types";
import { extractContour } from "./extract";
import { toContourSegments } from "./to-segments";

const derive = (entities: Entities) => {
  const { pass: outerEntities, fail: auxiliaryEntities } = partition(
    entities,
    (ent) => ent.role === "main_outer",
  );

  const contourCandidates = toContourSegments(outerEntities);
  const outerContour = extractContour(contourCandidates);
  const seamAllowance = ["to-do"];

  return { outerContour, seamAllowance, auxiliaryEntities };
};

export const deriveFromDocument = (document: PatternDocument) => {
  const { front: frontEnt, back: backEnt } = document.entities;

  const front = derive(frontEnt);
  const back = derive(backEnt);
  return { front, back };
};
