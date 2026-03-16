import type { ButtonHTMLAttributes } from "react";

export const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { children, ...rest } = props;
  // TODO: Add variants with CVA
  return (
    <button
      className="shrink-0 cursor-pointer rounded bg-rose-400 px-4 py-2 font-bold text-white hover:bg-rose-600 lg:w-32 lg:self-end"
      {...rest}
    >
      {children}
    </button>
  );
};
