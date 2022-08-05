import { useField } from "remix-validated-form";

type Props = { label: string; name: string; value: string };
export const FormCheckbox: React.VFC<Props> = ({ label, name, value }) => {
  const { getInputProps } = useField(name);
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
      <label className="form-check-label user-select-none" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};
