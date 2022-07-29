import type { ComponentPropsWithoutRef } from "react";
import { useMemo } from "react";
import { useField } from "remix-validated-form";
import { AppFormErrorMessage } from "./AppFormErrorMessage";

type Props = {
  label: string;
  name: string;
} & Omit<ComponentPropsWithoutRef<"input">, "className" | "name">;

export const AppFormInput: React.VFC<Props> = ({
  label,
  required,
  name,
  ...inputProps
}) => {
  const { getInputProps, error } = useField(name);

  const id = useMemo(() => {
    return `input-${label
      .split("")
      .reduce((prev, current) => prev + current.codePointAt(0), "")}`;
  }, [label]);

  return (
    <div className="row">
      <label htmlFor={id} className="col-sm-2 col-form-label text-nowrap">
        {required ? <span className="text-danger">*</span> : undefined}
        {label}
      </label>
      <div className="col-sm-10">
        <input
          className={`form-control ${error ? "is-invalid" : ""}`}
          {...getInputProps({ id, ...inputProps })}
        />
        {error && <AppFormErrorMessage>{error}</AppFormErrorMessage>}
      </div>
    </div>
  );
};
