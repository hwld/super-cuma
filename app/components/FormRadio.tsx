import { useField } from "remix-validated-form";
import { FormErrorMessage } from "./FormErrorMessage";

type Props = {
  name: string;
  items: { label: string; value: string }[];
};
export const FormRadio: React.VFC<Props> = ({ items, name }) => {
  const { getInputProps, error } = useField(name);

  return (
    <div>
      <div className="d-flex align-items-center">
        {items.map((item, i) => {
          return (
            <div className="form-check form-check-inline" key={item.value}>
              <input
                className={`form-check-input ${error ? "is-invalid" : ""}`}
                defaultChecked={i === 0}
                {...getInputProps({
                  type: "radio",
                  id: `${name}-${item.value}`,
                  value: item.value,
                })}
              />
              <label
                className="form-check-label"
                htmlFor={`${name}-${item.value}`}
              >
                {item.label}
              </label>
            </div>
          );
        })}
      </div>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </div>
  );
};
