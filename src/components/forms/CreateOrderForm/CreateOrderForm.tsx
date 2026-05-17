"use client";

import { useFormState } from "react-dom";
import { createOrder } from "@/actions/createOrder";
import { useState } from "react";
import { findErrors } from "@/lib/utils/findErrors";
import ErrorMessages from "@/components/ui/ErrorMessages";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { handleFormError } from "@/lib/utils/handleFormError";
import { formInitialState } from "@/constants/formInitialState";
import SubmitButton from "@/components/ui/SubmitButton";
import FormInput from "@/components/ui/FormInput";

function CreateOrderForm() {
  const [checked, setChecked] = useState(true);
  const [state, formAction] = useFormState(createOrder, formInitialState);

  const router = useRouter();

  const nameErrors = findErrors("name", state.message);
  const phoneErrors = findErrors("phone", state.message);
  const peopleCountErrors = findErrors("peopleCount", state.message);
  const scheduledAtErrors = findErrors("scheduledAt", state.message);
  const isLegalErrors = findErrors("isLegal", state.message);

  function handleSuccess(message: string) {
    if (typeof message === "string") {
      toast.success(message);
      router.back();
    }
    return;
  }

  return (
    <form action={formAction}>
      {state?.success && <>{handleSuccess(state.message as string)}</>}
      {state.success === false && <>{handleFormError(state.message)}</>}
      <div className="flex flex-col gap-8 mb-14">
        <div>
          <FormInput
            inputId={"name"}
            inputLabel={"Ваше ім'я"}
            type={"text"}
            required={true}
            placeholder={"Ваше ім'я"}
          />
          <ErrorMessages errors={nameErrors} />
        </div>
        <div>
          <FormInput
            inputId={"phone"}
            inputLabel={"Контактний телефон"}
            type={"tel"}
            required={true}
            placeholder={"0663782928"}
          />
          <ErrorMessages errors={phoneErrors} />
        </div>
        <div>
          <FormInput
            inputId={"peopleCount"}
            inputLabel={"Кількість учасників"}
            type={"text"}
            required={true}
            placeholder={"Кількість учасників - 3"}
          />
          <ErrorMessages errors={peopleCountErrors} />
        </div>
        <div>
          <label htmlFor="scheduledAt" className="block mb-2 text-sm font-medium text-textWhite">
            Дата та час
          </label>
          <input
            id="scheduledAt"
            name="scheduledAt"
            type="datetime-local"
            required
            className="py-4 px-6 bg-formsBackground border border-[rgb(72_0_66)] w-full text-gray-300"
          />
          <ErrorMessages errors={scheduledAtErrors} />
        </div>
      </div>
      <SubmitButton placeholder="Відправити заявку" />
      <p aria-live="polite" className="sr-only" role="status">
        {state.message === "string" ? state.message : ""}
      </p>
      <div className="flex flex-col">
        <div className="flex gap-2">
          <input
            type="checkbox"
            id="isLegal"
            name="isLegal"
            value={`${checked}`}
            checked={checked}
            onChange={() => setChecked(!checked)}
            className="cursor-pointer"
          />
          <label htmlFor="isLegal" className="text-sm text-textWhite">
            Я згодний з правилами обробки персональних даних
          </label>
        </div>
        <ErrorMessages errors={isLegalErrors} />
      </div>
    </form>
  );
}

export default CreateOrderForm;
