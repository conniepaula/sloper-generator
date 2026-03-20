import type { ComponentPropsWithRef, ElementType } from "react";

type ButtonProps<T extends ElementType = "button"> = {
  as?: T;
} & ComponentPropsWithRef<T>;

// TODO: Improve styling
export const Button = <T extends ElementType = "button">(
  props: ButtonProps<T>,
) => {
  const { as: Component = "button", ...rest } = props;
  // TODO: Add variants with CVA
  return (
    <Component
      className="shrink-0 cursor-pointer rounded bg-rose-400 px-4 py-2 font-bold text-white hover:bg-rose-600 focus:ring focus:ring-rose-300 focus:outline-none lg:w-32 lg:self-end"
      {...rest}
    />
  );
};
