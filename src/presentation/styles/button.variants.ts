import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  "transition-colors disabled:text-gray-500 disabled:bg-neutral disabled:cursor-not-allowed shrink-0 rounded focus:ring focus:outline-none cursor-pointer",
  {
    variants: {
      intent: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/80",
        neutral: "bg-neutral text-neutral-foreground hover:bg-neutral/80",
      },
      size: {
        small: "text-sm py-1 px-2",
        medium: "text-base py-2 px-4",
        icon: "rounded-full p-1",
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
