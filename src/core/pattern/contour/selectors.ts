import type { Entity, Piece, Role } from "../pattern.types";

export type Selector = { role?: Role; piece?: Piece };

export const matchesSelector = (ent: Entity, selector: Selector) => {
  if (selector.piece && selector.piece !== ent.piece) return false;
  if (selector.role && selector.role !== ent.role) return false;
  return true;
};
