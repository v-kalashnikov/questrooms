"use client";

import { useFormState } from "react-dom";
import FormInput from "@/components/ui/FormInput";
import SubmitButton from "@/components/ui/SubmitButton";
import { findErrors } from "@/lib/utils/findErrors";
import ErrorMessages from "@/components/ui/ErrorMessages";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import { handleFormError } from "@/lib/utils/handleFormError";
import { signIn } from "@/actions/signIn";
import { formInitialState } from "@/constants/formInitialState";
import { useEffect, useRef } from "react";

function SignInForm() {
  const [state, formAction] = useFormState(signIn, formInitialState);
  const toastShownRef = useRef(false);

  const router = useRouter();
  const params = useParams();
  const locale = params?.locale ?? "uk";

const emailErrors = findErrors("email", state?.message ?? "");
const passwordErrors = findErrors("password", state?.message ?? "");

  useEffect(() => {
    
    if (state && state.success === true) {
      if (!toastShownRef.current && typeof state.message === "string") {
        toast.success(state.message);
        toastShownRef.current = true;
      }
      
      setTimeout(() => {
        const target = `/${locale}/quests`;
        window.location.href = target;
      }, 500);
    }
  }, [state, locale]);

  return (
    <form action={formAction}>
      {state.success === false && <>{handleFormError(state.message)}</>}
      <h3 className="font-bold text-xl mb-2 text-center">Увійти в акаунт</h3>
      <div className="flex flex-col gap-8 mb-14">
        <div>
          <FormInput
            inputId={"email"}
            inputLabel={"Email"}
            type={"email"}
            required={true}
            placeholder={"Ваш email"}
          />
          <ErrorMessages errors={emailErrors} />
        </div>
        <div>
          <FormInput
            inputId={"password"}
            inputLabel={"Пароль"}
            type={"password"}
            required={true}
            placeholder={"Ваш пароль"}
          />
          <ErrorMessages errors={passwordErrors} />
        </div>
      </div>
      <SubmitButton placeholder="Увійти" className="flex flex-col gap-8 mb-14 hover:text-brandMagenta bg-opacity-75" />
      <p aria-live="polite" className="sr-only" role="status">
        {state.message === "string" ? state.message : ""}
      </p>
    </form>
  );
}

export default SignInForm;
