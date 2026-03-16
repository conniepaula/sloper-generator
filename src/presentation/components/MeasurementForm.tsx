import { ErrorMessage } from "@hookform/error-message";
import {
  useForm,
  type FieldValues,
  FormProvider,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormField } from "./ui/FormField";
import {
  getMeasurementsSchema,
  type SloperType,
} from "../../core/slopers/registry";
import { Form } from "./ui/Form";
import { typedEntries } from "../../shared/utils/collections";
import { Button } from "./ui/Button";

interface MeasurementFormProps<T extends FieldValues> {
  title: string;
  onSubmit: SubmitHandler<T>;
  sloperType: SloperType;
}

export const MeasurementForm = <T extends FieldValues>(
  props: MeasurementFormProps<T>,
) => {
  const { title, sloperType, onSubmit } = props;
  const { schema, defaultValue } = getMeasurementsSchema(sloperType);

  const methods = useForm({
    // TODO: Fix Zod v4 resolver issues
    resolver: zodResolver(schema),
    defaultValues: defaultValue,
  });

  const shape = schema.shape;

  return (
    <div className="absolute top-0 right-0 mt-2 mr-2 mb-4 flex h-96 w-96 flex-col gap-4 rounded bg-slate-100 px-6 py-4">
      <h1 className="text-xl font-bold">{title}</h1>
      <FormProvider {...methods}>
        <Form
          onSubmit={onSubmit}
          className="flex flex-col gap-6 overflow-y-hidden"
        >
          <div className="flex flex-1 flex-col gap-2 overflow-y-scroll">
            {typedEntries(shape).map(([id, opts]) => (
              <FormField.Root key={id}>
                {/*TODO: Add tooltip with how to measure*/}
                {opts.meta()?.title && (
                  <FormField.Label>{opts.meta()?.title}</FormField.Label>
                )}
                <FormField.Input register={methods.register} name={id} />
                <ErrorMessage
                  errors={methods.formState.errors}
                  name={id}
                  render={({ message }) => (
                    <FormField.Error>{message}</FormField.Error>
                  )}
                />
              </FormField.Root>
            ))}
          </div>
          <Button formAction="submit">Generate</Button>
        </Form>
      </FormProvider>
    </div>
  );
};
