import { draftBodice } from "../domains/bodice/bodice.draft";
import type { DrafterMap } from "./types";

export const drafters: DrafterMap = {
  bodice: (measurements) => {
    return draftBodice(measurements);
  },
};
