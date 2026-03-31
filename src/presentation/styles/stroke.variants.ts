import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import type { Role } from "../../core/pattern/drafting/types";

// SVG2PDF does not work with these css classes; leaving here for the future in case they start being supported
const strokeVariants = cva("stroke-[0.1] [fill-none]", {
  variants: {
    intent: {
      main_outer: "stroke-black",
      main_inner: "stroke-black",
      guide: "stroke-gray-300 [stroke-dasharray:0.3]",
      construction: "hidden",
    },
  },
  defaultVariants: {
    intent: "main_outer",
  },
});

export type StrokeVariants = VariantProps<typeof strokeVariants>;

export const stroke = (variants: StrokeVariants, className?: string) =>
  twMerge(strokeVariants(variants), className);

const common = { fill: "none", strokeWidth: "0.1" };

export const getStrokeVariant = (role: Role) => {
  switch (role) {
    case "construction":
      return { ...common, stroke: "transparent" };
    case "guide":
      return {
        ...common,
        strokeDasharray: "0.3",
        stroke: "#d6d3d1", // css variants and oklch don't work here. this is --color-neutral
      };
    default:
      return { ...common, stroke: "black" };
  }
};
