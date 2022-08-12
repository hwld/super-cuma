import type { TextFieldProps } from "@mui/material";
import { TextField } from "@mui/material";
import { useField } from "remix-validated-form";

type Props = {
  name: string;
  type?: TextFieldProps["type"];
  id?: string;
  label?: string;
  size?: TextFieldProps["size"];
  fullWidth?: boolean;
};
export const FormInput: React.VFC<Props> = ({
  name,
  id,
  label,
  size,
  type,
  fullWidth,
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
      {...getInputProps({ id })}
    />
  );
};
