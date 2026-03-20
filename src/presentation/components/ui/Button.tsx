import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import { cn } from "../../utils/cn";
import type { LucideIcon, LucideProps } from "lucide-react";

type ButtonOwnProps = {
  children: ReactNode;
  className?: string;
  icon?: LucideIcon;
  iconProps?: LucideProps;
};

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
    ...rest
  } = props;
  // TODO: Add variants with CVA
  return (
    <Component
      className={cn(
        "shrink-0 cursor-pointer rounded bg-rose-400 px-4 py-2 font-bold text-white hover:bg-rose-600 focus:ring focus:ring-rose-300 focus:outline-none lg:w-32 lg:self-end",
        className,
      )}
      {...rest}
    >
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
