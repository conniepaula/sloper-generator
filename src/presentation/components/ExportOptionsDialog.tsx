import { type RefObject } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download } from "lucide-react";
import { Field, Toast } from "@base-ui/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { pdfSizePairs } from "../../application/export/constants";
import { FormField } from "./ui/FormField";
import { Form } from "./ui/Form";
import { Button } from "./ui/Button";
import { ErrorMessage } from "@hookform/error-message";
import { exportSchema } from "../../application/export/schema";
import type { ExportSchema } from "../../application/export/types";
import type { Bounds } from "../../core/pattern/drafting/types";
import { exportPdf } from "../../application/export/export-pdf";
import { makeToast } from "../utils/make-toast-factory";
import type { ToastData } from "./ui/Toast";

interface ExportOptionsDialogProps {
  svgRef: RefObject<SVGSVGElement | null>;
  bounds: Bounds;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExportOptionsDialog = (props: ExportOptionsDialogProps) => {
  const { open, onOpenChange, svgRef, bounds } = props;

  const toastManager = Toast.useToastManager<ToastData>();

  const methods = useForm<ExportSchema>({
    resolver: zodResolver(exportSchema),
    defaultValues: { size: "a0" as const, fileName: "exported_pattern" },
  });
  const {
    register,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = methods;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset();
    }
    onOpenChange(nextOpen);
  };

  const handleFormSubmit: SubmitHandler<ExportSchema> = async (
    data: ExportSchema,
  ) => {
    const svg = svgRef.current;
    if (!svg) return;

    const result = await exportPdf(svg, bounds, { ...data });
    if (result.ok) {
      handleOpenChange(false);
      reset();
    }

    const toast = result.ok
      ? makeToast({ ok: true, code: "EXPORT_SUCCESSFUL" })
      : makeToast({ ok: false, code: result.error.code });
    toastManager.add<ToastData>(toast);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Export options
          </DialogTitle>
          <DialogDescription>
            After selecting your desired options, press download to export your
            pattern.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <Form className="flex flex-col gap-3" onSubmit={handleFormSubmit}>
            <FormField.Root>
              <FormField.Label htmlFor="fileName">File Name</FormField.Label>
              <div className="relative w-full">
                <FormField.Input
                  name="fileName"
                  register={register}
                  id="fileName"
                  className="w-full pr-14"
                  placeholder="Exported file name..."
                />
                <span className="bg-neutral-light text-neutral pointer-events-none absolute inset-y-0 right-0 flex items-center rounded rounded-l-none border-y border-r px-3">
                  .pdf
                  <span className="sr-only">
                    File extension ".pdf" is already included and can't be
                    changed.
                  </span>
                </span>
              </div>
              <ErrorMessage
                errors={errors}
                name="fileName"
                render={({ message }) => (
                  <FormField.Error>{message}</FormField.Error>
                )}
              />
            </FormField.Root>
            <Controller
              name="size"
              control={control}
              render={({
                field: { ref, name, value, onBlur, onChange },
                fieldState: { invalid, isTouched, isDirty },
              }) => (
                <Field.Root
                  name={name}
                  invalid={invalid}
                  touched={isTouched}
                  dirty={isDirty}
                  className="flex w-full flex-col gap-2"
                >
                  <FormField.Label>Printable Paper Size</FormField.Label>
                  <Select
                    items={pdfSizePairs}
                    value={value}
                    onValueChange={onChange}
                    inputRef={ref}
                  >
                    <SelectTrigger className="w-full" onBlur={onBlur}>
                      <SelectValue placeholder="Select page size" />
                    </SelectTrigger>
                    <SelectContent>
                      {pdfSizePairs.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    errors={errors}
                    name={name}
                    render={({ message }) => (
                      <FormField.Error>{message}</FormField.Error>
                    )}
                  />
                </Field.Root>
              )}
            />
            <Button
              type="submit"
              id="exportSubmitButton"
              disabled={isSubmitting}
              icon={Download}
            >
              Download
            </Button>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
