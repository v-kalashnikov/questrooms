type FormInputProps = {
  inputId: string;
  inputLabel: string;
  type: string;
  required: boolean;
  placeholder: string;
};

function FormInput({
  inputId,
  inputLabel,
  required,
  type,
  placeholder,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-3 items-start">
      <label htmlFor={inputId} className="text-textWhite">{inputLabel}</label>
      <input
        type={type}
        id={inputId}
        name={inputId}
        required={required}
        className="py-4 px-6 bg-formsBackground border border-[rgb(72_0_66)] w-[400px] text-gray-300 placeholder-gray-500 w-full"
        placeholder={placeholder}
      />
    </div>
  );
}

export default FormInput;
