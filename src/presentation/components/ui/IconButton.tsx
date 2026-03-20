import type { LucideIcon, LucideProps } from "lucide-react";
import type { ComponentPropsWithRef, ElementType } from "react";
import { cn } from "../../utils/cn";

type IconButtonOwnProps = {
  icon: LucideIcon;
  iconProps?: LucideProps;
  children?: never;
  "aria-label": string;
  className?: string;
};

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
    ...rest
  } = props;
  return (
    <Component
      className={cn(
        "rounded-full bg-gray-200 focus:ring focus:ring-rose-300 focus:outline-none",
        className,
      )}
      {...rest}
    >
      <Icon {...iconProps} />
    </Component>
  );
};
