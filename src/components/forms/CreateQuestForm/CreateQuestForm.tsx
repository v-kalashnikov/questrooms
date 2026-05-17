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
import { questImages } from "@/constants/questImages";

function CreateQuestForm() {
  const [state, formAction] = useFormState(createQuest, formInitialState);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");

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

  const availableImages = selectedType ? questImages[selectedType] || [] : [];

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {state?.success && <>{handleSuccess(state.message as string)}</>}
      {state.success === false && <>{handleFormError(state.message)}</>}
      <div>
        <FormInput
          inputId={"title"}
          inputLabel={"Назва"}
          type={"text"}
          required={true}
          placeholder={"Назва квесту"}
        />
        <ErrorMessages errors={titleErrors} />
      </div>
      <div>
        <label htmlFor="description" className="text-textWhite">Опис</label>
        <textarea
          id="description"
          name="description"
          required
          placeholder="Опис квесту"
          className="border border-[rgb(72_0_66)] rounded p-2 w-full h-24 bg-formsBackground text-gray-300 placeholder-gray-500"
        />
        <ErrorMessages errors={descriptionErrors} />
      </div>
      <div>
        <label htmlFor="type" className="text-textWhite">Тип</label>
        <select
          id="type"
          name="type"
          required
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setSelectedImage(""); // Reset image when type changes
          }}
          className="border border-[rgb(72_0_66)] rounded p-2 w-full bg-formsBackground text-gray-300"
        >
          <option value="" className="bg-formsBackground">Оберіть тип</option>
          {Object.keys(questImages).map((type) => (
            <option key={type} value={type} className="bg-formsBackground">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        <ErrorMessages errors={typeErrors} />
      </div>
      <div>
        <label htmlFor="image" className="text-textWhite">Картинка</label>
        <select
          id="image"
          name="image"
          required
          value={selectedImage}
          onChange={(e) => setSelectedImage(e.target.value)}
          className="border border-[rgb(72_0_66)] rounded p-2 w-full bg-formsBackground text-gray-300"
          disabled={!selectedType}
        >
          <option value="">Оберіть картинку</option>
          {availableImages.map((image) => (
            <option key={image} value={image}>
              {image.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </option>
          ))}
        </select>
        <ErrorMessages errors={previewImgErrors} />
      </div>
      <input type="hidden" name="previewImg" value={`preview-${selectedImage}.jpg`} />
      <input type="hidden" name="coverImg" value={`cover-${selectedImage}.jpg`} />
      <div>
        <FormInput
          inputId={"level"}
          inputLabel={"Складність"}
          type={"text"}
          required={true}
          placeholder={"Складність"}
        />
        <ErrorMessages errors={levelErrors} />
      </div>
      <div>
        <label htmlFor="peopleCount" className="text-textWhite">Кількість осіб (через кому мін. та макс.)</label>
        <input
          id="peopleCount"
          name="peopleCount"
          type="text"
          required
          placeholder="e.g., 2,4,6"
          className="border border-[rgb(72_0_66)] rounded p-2 bg-formsBackground w-full text-gray-300 placeholder-gray-500"
        />
        <ErrorMessages errors={peopleCountErrors} />
      </div>
      <div>
        <FormInput
          inputId={"duration"}
          inputLabel={"Тривалість (хвилини)"}
          type={"number"}
          required={true}
          placeholder={"Тривалість"}
        />
        <ErrorMessages errors={durationErrors} />
      </div>
      <SubmitButton placeholder="Додати квест" />
    </form>
  );
}

export default CreateQuestForm;