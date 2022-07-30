import { useField } from "remix-validated-form";
import { FormErrorMessage } from "./FormErrorMessage";

type Props = {
  id: string;
  name: string;
  items: { label: string; value: string | number }[];
};
export const FormSelect: React.VFC<Props> = ({ id, name, items }) => {
  const { getInputProps, error } = useField(name);

  return (
    <div>
      <select
        className={`form-select ${error ? "is-invalid" : ""}`}
        {...getInputProps({ id })}
      >
        {items.map((item) => {
          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </div>
  );
};
