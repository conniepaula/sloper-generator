import type {
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

export const FormField = ({ children }: { children?: ReactNode }) => {
  return <div className="flex flex-col gap-1">{children}</div>;
};

export interface InputProps<
  T extends FieldValues,
> extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<T>;
  name: Path<T>;
}

export const Input = <T extends FieldValues>(props: InputProps<T>) => {
  const { register, name, ...rest } = props;
  return (
    <input
      className="appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:ring focus:ring-rose-300 focus:outline-none"
      {...register(name)}
      {...rest}
    />
  );
};

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?: boolean;
}

const Label = (props: LabelProps) => {
  const { children, required = true, ...rest } = props;
  return (
    <ConditionalWrap
      condition={required}
      wrap={(label) => (
        <div className="flex w-fit gap-1">
          {label}
          <span className="text-red-700">*</span>
        </div>
      )}
    >
      <label className="block w-fit text-sm font-bold text-gray-700" {...rest}>
        {children}
      </label>
    </ConditionalWrap>
  );
};

const Error = ({ children }: { children?: ReactNode }) => {
  return <p className="text-xs text-red-500 italic">{children}</p>;
};

FormField.Root = FormField;
FormField.Input = Input;
FormField.Label = Label;
FormField.Error = Error;
