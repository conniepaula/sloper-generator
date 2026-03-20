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
    formState: { errors },
  } = methods;

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
            {typedEntries(shape).map(([id, opts]) => {
              const { title, description } = opts.meta() ?? {};
              return (
                <FormField.Root key={id}>
                  <div className="flex items-center justify-between">
                    <FormField.Label htmlFor={id}>{title}</FormField.Label>
                    <Tooltip
                      tooltipContent={
                        <span className="text-center">{description}</span>
                      }
                    >
                      <IconButton
                        icon={Info}
                        iconProps={{ size: 18, className: "text-slate-700" }}
                        aria-label={`More information on how to measure ${title}`}
                      />
                    </Tooltip>
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
          <Button formAction="submit" type="submit" id="submitButton">
            Generate
          </Button>
        </Form>
      </FormProvider>
    </div>
  );
};
