import { RefObject } from "react";
import toast from "react-hot-toast";
import { ZodIssue } from "zod";

export function handleFormError(
  message: string | ZodIssue[],
  toastShownRef?: RefObject<boolean> | null
) {
  if (typeof message === "string" && message) {
    if (!toastShownRef?.current) {
      toast.error(message);
    }
  }
  return;
}
