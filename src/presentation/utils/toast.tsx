import { toast as sonnerToast } from "sonner";
import { Toast, type ToastProps } from "../components/ui/Toast";

export const toast = (toast: Omit<ToastProps, "id">) => {
  return sonnerToast.custom((id) => <Toast id={id} {...toast} />);
};
