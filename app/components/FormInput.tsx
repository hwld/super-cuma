import type { ComponentPropsWithoutRef } from "react";
import { useField } from "remix-validated-form";
import { FormErrorMessage } from "./FormErrorMessage";

type Props = {
  name: string;
  id?: string;
  size?: "md" | "sm";
} & Omit<ComponentPropsWithoutRef<"input">, "size">;
export const FormInput: React.VFC<Props> = ({
  name,
  id,
  size = "md",
  ...inputProps
}) => {
  const { getInputProps, error } = useField(name);
  return (
    <div>
      <input
        className={`form-control ${error ? "is-invalid" : ""} ${
          size === "sm" ? "form-control-sm" : ""
        }`}
        {...getInputProps({ id, ...inputProps })}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </div>
  );
};
