import { type ReactElement, type ReactNode, Children } from "react";
import {
  useFormContext,
  type FieldValues,
  type Path,
  type SubmitHandler,
} from "react-hook-form";

import { Input, type InputProps } from "./FormField";

interface FormProps<T extends FieldValues> {
  children: ReactNode;
  onSubmit: SubmitHandler<T>;
  className?: string;
}

const isInputElement = <T extends FieldValues>(
  child: ReactNode,
): child is ReactElement<InputProps<T>> => {
  return (
    !!child &&
    typeof child === "object" &&
    "props.name" in child &&
    "props.register" in child
  );
};

export const Form = <T extends FieldValues>(props: FormProps<T>) => {
  const { children, onSubmit, className = "" } = props;
  const methods = useFormContext<T>();
  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
      {Children.map(children, (child) => {
        if (isInputElement(child))
          return (
            <Input
              {...child.props}
              register={methods.register}
              key={child.props.name as Path<T>}
              name={child.props.name as Path<T>}
            />
          );
        return child;
      })}
    </form>
  );
};
