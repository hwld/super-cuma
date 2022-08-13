import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useMemo } from "react";
import { useField } from "remix-validated-form";
import { FormErrorMessage } from "./FormErrorMessage";

type Props = { label: string; name: string; value: string; offValue: string };
export const FormCheckbox: React.VFC<Props> = ({
  label,
  name,
  value,
  offValue,
}) => {
  const { getInputProps, error, defaultValue } = useField(name);

  const defaultChecked = useMemo(() => {
    const defaultString = defaultValue?.toString();
    if (defaultString === undefined) {
      return false;
    }
    return value === defaultString;
  }, [defaultValue, value]);

  return (
    <div>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              {...getInputProps({ value })}
              defaultChecked={defaultChecked}
            />
          }
          label={label}
        />
      </FormGroup>
      <input hidden name={name} defaultValue={offValue} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </div>
  );
};
