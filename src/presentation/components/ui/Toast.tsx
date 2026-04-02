import { Toast } from "@base-ui/react/toast";
import { Ban, Check, X } from "lucide-react";
import clsx from "clsx";
import { IconButton } from "./IconButton";

export interface ToastData {
  type: "success" | "failure";
}

export const ToastList = () => {
  const { toasts } = Toast.useToastManager<ToastData>();

  return toasts.map((toast) => {
    const { type } = toast.data ?? { type: "failure" as const };
    const Icon = type === "success" ? Check : Ban;
    return (
      <Toast.Root
        key={toast.id}
        toast={toast}
        className="absolute right-0 bottom-0 left-auto z-[calc(1000-var(--toast-index))] mr-0 h-[var(--height)] w-full origin-bottom [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] rounded-lg border border-gray-200 bg-gray-50 bg-clip-padding p-4 shadow-lg select-none [--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))] [transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s] after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-[''] data-[ending-style]:opacity-0 data-[expanded]:h-[var(--toast-height)] data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--offset-y)))] data-[limited]:opacity-0 data-[starting-style]:[transform:translateY(150%)] data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-[expanded]:data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-[expanded]:data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-[expanded]:data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))] data-[expanded]:data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))] sm:max-w-lg sm:min-w-xs [&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]"
      >
        <Toast.Content className="overflow-hidden transition-opacity [transition-duration:250ms] data-[behind]:pointer-events-none data-[behind]:opacity-0 data-[expanded]:pointer-events-auto data-[expanded]:opacity-100">
          <div className="grid grid-cols-[auto_1fr] gap-4">
            <Icon
              className={clsx(
                "h-8 w-8",
                type === "success" ? "stroke-success" : "stroke-destructive",
              )}
            />
            <div className="flex w-full flex-col gap-1">
              <div className="flex w-full justify-between gap-2">
                <Toast.Title className="text-left text-sm leading-5 font-medium" />
                <Toast.Close
                  // className="flex h-5 w-5 items-center justify-center rounded-sm border-none bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close"
                  render={
                    <IconButton icon={X} aria-label="Close" intent="ghost" />
                  }
                >
                  {/*<X size={18} />*/}
                </Toast.Close>
              </div>
              {toast.description && (
                <Toast.Description className="text-neutral-dark text-xs leading-5" />
              )}
            </div>
          </div>
        </Toast.Content>
      </Toast.Root>
    );
  });
};
