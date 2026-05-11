"use client";

import { useFormState } from "react-dom";
import { createQuest } from "@/actions/createQuest";
import { useState } from "react";
import { findErrors } from "@/lib/utils/findErrors";
import ErrorMessages from "@/components/ui/ErrorMessages";
import toast from "react-hot-toast";
import { handleFormError } from "@/lib/utils/handleFormError";
import { formInitialState } from "@/constants/formInitialState";
import SubmitButton from "@/components/ui/SubmitButton";
import FormInput from "@/components/ui/FormInput";

function CreateQuestForm() {
  const [state, formAction] = useFormState(createQuest, formInitialState);

  const titleErrors = findErrors("title", state.message);
  const descriptionErrors = findErrors("description", state.message);
  const previewImgErrors = findErrors("previewImg", state.message);
  const coverImgErrors = findErrors("coverImg", state.message);
  const typeErrors = findErrors("type", state.message);
  const levelErrors = findErrors("level", state.message);
  const peopleCountErrors = findErrors("peopleCount", state.message);
  const durationErrors = findErrors("duration", state.message);

  function handleSuccess(message: string) {
    if (typeof message === "string") {
      toast.success(message);
    }
    return;
  }

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {state?.success && <>{handleSuccess(state.message as string)}</>}
      {state.success === false && <>{handleFormError(state.message)}</>}
      <div>
        <FormInput
          inputId={"title"}
          inputLabel={"Title"}
          type={"text"}
          required={true}
          placeholder={"Quest title"}
        />
        <ErrorMessages errors={titleErrors} />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          required
          placeholder="Quest description"
          className="border rounded p-2 w-full h-24"
        />
        <ErrorMessages errors={descriptionErrors} />
      </div>
      <div>
        <FormInput
          inputId={"previewImg"}
          inputLabel={"Preview Image URL"}
          type={"text"}
          required={true}
          placeholder={"Preview image URL"}
        />
        <ErrorMessages errors={previewImgErrors} />
      </div>
      <div>
        <FormInput
          inputId={"coverImg"}
          inputLabel={"Cover Image URL"}
          type={"text"}
          required={true}
          placeholder={"Cover image URL"}
        />
        <ErrorMessages errors={coverImgErrors} />
      </div>
      <div>
        <FormInput
          inputId={"type"}
          inputLabel={"Type"}
          type={"text"}
          required={true}
          placeholder={"Quest type"}
        />
        <ErrorMessages errors={typeErrors} />
      </div>
      <div>
        <FormInput
          inputId={"level"}
          inputLabel={"Level"}
          type={"text"}
          required={true}
          placeholder={"Quest level"}
        />
        <ErrorMessages errors={levelErrors} />
      </div>
      <div>
        <label htmlFor="peopleCount">People Count (comma separated)</label>
        <input
          id="peopleCount"
          name="peopleCount"
          type="text"
          required
          placeholder="e.g., 2,4,6"
          className="border rounded p-2"
        />
        <ErrorMessages errors={peopleCountErrors} />
      </div>
      <div>
        <FormInput
          inputId={"duration"}
          inputLabel={"Duration (minutes)"}
          type={"number"}
          required={true}
          placeholder={"Duration"}
        />
        <ErrorMessages errors={durationErrors} />
      </div>
      <SubmitButton text="Create Quest" />
    </form>
  );
}

export default CreateQuestForm;