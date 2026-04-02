import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  "transition-colors disabled:text-gray-500 disabled:bg-neutral-light disabled:cursor-not-allowed shrink-0 rounded focus:ring focus:outline-none cursor-pointer",
  {
    variants: {
      intent: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/80",
        neutral:
          "bg-neutral-light text-neutral-foreground hover:bg-neutral-light/80",
      },
      size: {
        sm: "text-sm py-1 px-2",
        medium: "text-base py-2 px-4",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "medium",
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export const button = (variants: ButtonVariants, className?: string) =>
  twMerge(buttonVariants(variants), className);

const iconButtonVariants = cva(
  "inline-flex items-center justify-center p-1 aspect-square! rounded-full transition-colors",
  {
    variants: {
      intent: {
        neutral:
          "bg-neutral-light stroke-neutral-foreground hover:bg-neutral-light/80",
        ghost:
          "bg-transparent stroke-neutral-foreground hover:bg-neutral-light/40 border-none",
      },
      size: {
        sm: "w-5 h-5",
        md: "w-7 h-7",
      },
    },
    defaultVariants: {
      intent: "neutral",
      size: "md",
    },
  },
);

export type IconButtonVariants = VariantProps<typeof iconButtonVariants>;

export const iconButton = (variants: IconButtonVariants, className?: string) =>
  twMerge(iconButtonVariants(variants), className);
