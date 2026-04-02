import type { LucideIcon, LucideProps } from "lucide-react";
import type { ComponentPropsWithRef, ElementType } from "react";

import {
  iconButton,
  type IconButtonVariants,
} from "../../styles/button.variants";
import { cn } from "../../lib/cn";

interface IconButtonOwnProps extends IconButtonVariants {
  icon: LucideIcon;
  iconProps?: LucideProps;
  children?: never;
  "aria-label": string;
  className?: string;
}

type IconButtonProps<T extends ElementType = "button"> = IconButtonOwnProps & {
  as?: T;
} & Omit<ComponentPropsWithRef<T>, keyof IconButtonOwnProps | "as">;

// TODO: Improve styling
export const IconButton = <T extends ElementType = "button">(
  props: IconButtonProps<T>,
) => {
  const {
    icon: Icon,
    iconProps = { className: "" },
    as: Component = "button",
    className,
    intent,
    size,
    ...rest
  } = props;
  const { className: iconClassName, ...iconRest } = iconProps;
  return (
    <Component className={iconButton({ intent, size }, className)} {...rest}>
      <Icon className={cn("h-5 w-5 shrink-0", iconClassName)} {...iconRest} />
      <span className="sr-only">{rest["aria-label"]}</span>
    </Component>
  );
};
