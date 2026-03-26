import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const strokeVariants = cva("stroke-[0.1] fill-none", {
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
