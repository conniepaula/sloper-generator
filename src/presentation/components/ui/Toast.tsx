import { toast as sonnerToast } from "sonner";
import { CircleX } from "lucide-react";

import { Button } from "./Button";

export interface ToastProps {
  id: string | number;
  title: string;
  description: string;
  button?: {
    label: string;
    onClick: () => void;
  };
}

/** A fully custom toast that still maintains the animations and interactions. */
export const Toast = (props: ToastProps) => {
  const { title, description, button, id } = props;

  return (
    <div className="flex w-full items-center rounded-lg bg-white p-4 shadow-lg ring-1 ring-black/5 md:max-w-[364px]">
      <div className="flex flex-1 items-center gap-3">
        <CircleX size={36} className="text-rose-600" />
        <div className="w-full">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
      {button && (
        <Button
          onClick={() => {
            button.onClick();
            sonnerToast.dismiss(id);
          }}
        >
          {button.label}
        </Button>
      )}
    </div>
  );
};
