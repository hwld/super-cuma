import { useField } from "remix-validated-form";
import { AppFormErrorMessage } from "./AppFormErrorMessage";

type Props = {
  name: string;
  label: string;
  items: { label: string; value: string | number }[];
  required?: boolean;
};
export const AppFormSelect: React.VFC<Props> = ({
  name,
  label,
  items,
  required,
}) => {
  const { getInputProps, error } = useField(name);

  return (
    <div className="row">
      <label className="col-sm-2 col-form-label text-nowrap">
        {required ? <span className="text-danger">*</span> : undefined}
        {label}
      </label>
      <div className="col-sm-10">
        <select
          className={`form-select ${error ? "is-invalid" : ""}`}
          {...getInputProps()}
        >
          {items.map((item) => {
            return (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </select>
        {error && <AppFormErrorMessage>{error}</AppFormErrorMessage>}
      </div>
    </div>
  );
};
