import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import type { LucideIcon, LucideProps } from "lucide-react";

import { button, type ButtonVariants } from "../../styles/button.variants";

interface ButtonOwnProps extends ButtonVariants {
  children: ReactNode;
  className?: string;
  icon?: LucideIcon;
  iconProps?: LucideProps;
}

type ButtonProps<T extends ElementType = "button"> = ButtonOwnProps & {
  as?: T;
} & Omit<ComponentPropsWithRef<T>, keyof ButtonOwnProps | "as">;

// TODO: Improve styling
export const Button = <T extends ElementType = "button">(
  props: ButtonProps<T>,
) => {
  const {
    as: Component = "button",
    icon: Icon,
    iconProps = { size: 18 },
    children,
    className,
    intent,
    size,
    ...rest
  } = props;
  return (
    <Component className={button({ intent, size }, className)} {...rest}>
      {Icon ? (
        <span className="flex items-center justify-center gap-2">
          <Icon {...iconProps} />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </Component>
  );
};
