import { useField } from "remix-validated-form";
import { AppFormErrorMessage } from "./AppFormErrorMessage";

type Props = {
  name: string;
  fieldName?: string;
  items: { label: string; value: string }[];
  required?: boolean;
};
export const AppFormRadio: React.VFC<Props> = ({
  name,
  fieldName,
  items,
  required,
}) => {
  const { getInputProps, error } = useField(name);

  return (
    <div className="row align-items-start">
      <div className="col-sm-2 col-form-label">
        {required ? <span className="text-danger">*</span> : undefined}
        {fieldName}
      </div>
      <div className="col-sm-10">
        <div className="d-flex align-items-center">
          {items.map((item, i) => {
            return (
              <div className="form-check form-check-inline" key={item.value}>
                <input
                  className={`form-check-input ${error ? "is-invalid" : ""}`}
                  defaultChecked={i === 0}
                  {...getInputProps({
                    type: "radio",
                    id: item.value,
                    value: item.value,
                  })}
                />
                <label className="form-check-label" htmlFor={item.value}>
                  {item.label}
                </label>
              </div>
            );
          })}
        </div>
        {error && <AppFormErrorMessage>{error}</AppFormErrorMessage>}
      </div>
    </div>
  );
};
