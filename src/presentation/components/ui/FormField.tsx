import type {
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from "react";
import {
  type UseFormRegister,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { ConditionalWrap } from "../layout/ConditionalWrap";
import { cn } from "../../utils/cn";

export const FormField = ({ children }: { children?: ReactNode }) => {
  return <div className="flex flex-col gap-1">{children}</div>;
};

export interface InputProps<T extends FieldValues> extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  register: UseFormRegister<T>;
  name: Path<T>;
  size?: "sm" | "default";
}

export const Input = <T extends FieldValues>(props: InputProps<T>) => {
  const { register, name, className, size = "default", ...rest } = props;
  return (
    <input
      data-size={size}
      className={cn(
        "bg-background focus:ring-primary appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:ring focus:outline-none data-[size=default]:h-9 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)]",
        className,
      )}
      {...register(name)}
      {...rest}
    />
  );
};

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = (props: LabelProps) => {
  const { required = true, className, ...rest } = props;
  return (
    <ConditionalWrap
      condition={required}
      wrap={(label) => (
        <div className="flex w-fit gap-1">
          {label}
          <span
            className="text-primary-dark"
            aria-label="Form field is required."
          >
            *
          </span>
        </div>
      )}
    >
      <label
        className={cn("block w-fit text-sm font-bold", className)}
        {...rest}
      />
    </ConditionalWrap>
  );
};

const Error = (props: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className="text-xs text-red-500 italic" role="alert" {...props} />
  );
};

FormField.Root = FormField;
FormField.Input = Input;
FormField.Label = Label;
FormField.Error = Error;
