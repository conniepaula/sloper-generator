import type { LucideIcon, LucideProps } from "lucide-react";
import type { ComponentPropsWithRef, ElementType } from "react";

import { button, type ButtonVariants } from "../../styles/button.variants";

interface IconButtonOwnProps extends Omit<ButtonVariants, "size"> {
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
    iconProps = { size: 18 },
    as: Component = "button",
    className,
    intent = "neutral",
    ...rest
  } = props;
  return (
    <Component
      className={button({ intent, size: "icon" }, className)}
      {...rest}
    >
      <Icon {...iconProps} />
      <span className="sr-only">{rest["aria-label"]}</span>
    </Component>
  );
};
