import * as z from "zod";
import { ErrorMessage } from "@hookform/error-message";
import {
  useForm,
  type FieldValues,
  FormProvider,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";

import { FormField } from "./ui/FormField";
import {
  getMeasurementsSchema,
  type SloperType,
} from "../../core/slopers/registry";
import { Form } from "./ui/Form";
import { typedEntries } from "../../shared/utils/collections";
import { Button } from "./ui/Button";
import { Tooltip } from "./ui/Tooltip";
import { IconButton } from "./ui/IconButton";

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
  const {
    register,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = methods;

  const shape = schema.shape;

  const handleFormSubmit = (data: T) => {
    if (!isDirty) return;

    onSubmit(data);
    reset(data);
  };

  return (
    <FormProvider {...methods}>
      <Form
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-6 md:overflow-y-hidden"
      >
        <div className="flex flex-1 flex-col gap-2 md:overflow-y-scroll">
          {typedEntries(shape).map(([id, opts]) => {
            const { title, description } = opts.meta() ?? {};
            return (
              <FormField.Root key={id}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <FormField.Label htmlFor={id}>{title}</FormField.Label>
                  <div className="hidden md:block">
                    <Tooltip
                      tooltipContent={
                        <span className="text-center">{description}</span>
                      }
                    >
                      <IconButton
                        icon={Info}
                        iconProps={{ size: 18, className: "text-gray-700" }}
                        aria-label={`More information on how to measure ${title}`}
                        type="button"
                      />
                    </Tooltip>
                  </div>
                  <span className="mb-1 block text-xs md:hidden">
                    {description}
                  </span>
                </div>
                <FormField.Input
                  register={register}
                  name={id}
                  id={id}
                  aria-invalid={errors[id] ? "true" : "false"}
                />
                <ErrorMessage
                  errors={errors}
                  name={id}
                  render={({ message }) => (
                    <FormField.Error>{message}</FormField.Error>
                  )}
                />
              </FormField.Root>
            );
          })}
        </div>
        {/*TODO: Fix clipped outline/ring when active*/}
        <Button
          formAction="submit"
          type="submit"
          id="submitButton"
          disabled={!isDirty || isSubmitting}
        >
          Generate
        </Button>
      </Form>
    </FormProvider>
  );
};
