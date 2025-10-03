import { AxiosError } from "axios";
import { toast } from "react-toastify";

//
type TErrors =
  | Array<{ errorMessage: string; id: string; key: string; objectName: string }>
  | { [key: string]: string | string[] }
  | string
  | undefined;

//
export type TUtilHandleServiceErrorProps = {
  error: unknown;
  baseErrorMessage?: string | number | null | undefined | false;
  isToast?: boolean;
  showToastOnAuthError?: boolean;
};

//
export const utilHandleServiceError = ({
  error,
  baseErrorMessage = "Произошла ошибка",
  isToast = true,
  showToastOnAuthError = false,
}: TUtilHandleServiceErrorProps) => {
  console.log("utilHandleServiceError", error);

  //
  if (error instanceof AxiosError) {
    const errors = (error.response?.data?.errors ||
      error.response?.data) as TErrors;
    const message = (() => {
      if (Array.isArray(errors))
        return errors?.map((item) => item?.errorMessage)?.join(". ");
      if (typeof errors === "object")
        return Object.entries(errors)
          .map(
            ([key, value]) =>
              `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
          )
          .join(". ");
      if (typeof errors === "string") return errors;
      return null;
    })();

    //
    const finalMessage = message || baseErrorMessage;
    if (
      isToast &&
      finalMessage &&
      (showToastOnAuthError ||
        (error.status && error.status !== 401 && error.status !== 403))
    )
      toast.error(finalMessage);
    return new Error(finalMessage + "");
  }

  //
  isToast && toast.error(baseErrorMessage);
  return new Error(baseErrorMessage + "");
};
