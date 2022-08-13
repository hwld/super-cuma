import type { TextFieldProps } from "@mui/material";
import { TextField } from "@mui/material";
import { useField } from "remix-validated-form";

type Props = {
  name: string;
  type?: TextFieldProps["type"];
  id?: string;
  label?: string;
  size?: TextFieldProps["size"];
  autoComplete?: TextFieldProps["autoComplete"];
};
export const FormInput: React.VFC<Props> = ({
  name,
  id,
  label,
  size,
  type,
  autoComplete,
}) => {
  const { getInputProps, error } = useField(name);
  return (
    <TextField
      label={label}
      size={size}
      type={type}
      error={error !== undefined}
      helperText={error}
      fullWidth
      autoComplete={autoComplete}
      {...getInputProps({ id })}
    />
  );
};
