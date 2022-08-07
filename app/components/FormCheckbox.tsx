import { useField } from "remix-validated-form";
import { FormErrorMessage } from "./FormErrorMessage";

type Props = { label: string; name: string; value: string; offValue: string };
export const FormCheckbox: React.VFC<Props> = ({
  label,
  name,
  value,
  offValue,
}) => {
  const { getInputProps, error } = useField(name);
  const id = label
    .split("")
    .reduce((prev, curr) => prev + curr.codePointAt(0), "");

  return (
    <div className="form-check">
      <input
        className="form-check-input"
        {...getInputProps({
          type: "checkbox",
          id,
          value,
        })}
      />
      <input hidden name={name} defaultValue={offValue} />
      <label className="form-check-label user-select-none" htmlFor={id}>
        {label}
      </label>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </div>
  );
};
