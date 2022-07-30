import type { ComponentPropsWithoutRef } from "react";
import { useField } from "remix-validated-form";
import { FormErrorMessage } from "./FormErrorMessage";

type Props = { name: string; id: string } & ComponentPropsWithoutRef<"input">;
export const FormInput: React.VFC<Props> = ({ name, id, ...inputProps }) => {
  const { getInputProps, error } = useField(name);
  return (
    <div>
      <input
        className={`form-control ${error ? "is-invalid" : ""}`}
        {...getInputProps({ id, ...inputProps })}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </div>
  );
};
