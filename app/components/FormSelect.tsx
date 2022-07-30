import { useField } from "remix-validated-form";
import { FormErrorMessage } from "./FormErrorMessage";

type Props = {
  id: string;
  name: string;
  items: { label: string; value: string | number | undefined }[];
  size?: "sm" | "md";
};
export const FormSelect: React.VFC<Props> = ({
  id,
  name,
  items,
  size = "md",
}) => {
  const { getInputProps, error } = useField(name);

  return (
    <div>
      <select
        className={`form-select ${error ? "is-invalid" : ""} ${
          size === "sm" ? "form-select-sm" : ""
        }`}
        {...getInputProps({ id })}
      >
        {items.map((item, i) => {
          return (
            <option key={i} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </div>
  );
};
