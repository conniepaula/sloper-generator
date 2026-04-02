import {
  ERROR_TOAST_DESCRIPTION,
  ERROR_TOAST_TITLE,
  SUCCESS_TOAST_TITLE,
  type UIErrorCodes,
  type UISuccessCodes,
} from "../constants";

type ToastFactoryParams =
  | { ok: false; code: UIErrorCodes }
  | { ok: true; code: UISuccessCodes };

export const makeToast = (params: ToastFactoryParams) => {
  const { ok, code } = params;
  if (ok) {
    return {
      title: SUCCESS_TOAST_TITLE[code],
      description: undefined,
      data: { type: "success" as const },
    };
  }

  return {
    title: ERROR_TOAST_TITLE[code],
    description: ERROR_TOAST_DESCRIPTION[code],
    data: { type: "failure" as const },
  };
};
