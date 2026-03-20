import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ComponentPropsWithRef, ElementType } from "react";

type IconButtonProps<T extends ElementType = "button"> = {
  icon: LucideIcon;
  iconProps?: ComponentProps<LucideIcon>;
  as?: T;
} & ComponentPropsWithRef<T>;

// TODO: Improve styling
export const IconButton = <T extends ElementType = "button">(
  props: IconButtonProps<T>,
) => {
  const { icon: Icon, iconProps, as: Component = "button", ...rest } = props;
  return (
    <Component
      className="rounded-full bg-slate-200 focus:ring focus:ring-rose-300 focus:outline-none"
      {...rest}
    >
      <Icon {...iconProps} />
    </Component>
  );
};
