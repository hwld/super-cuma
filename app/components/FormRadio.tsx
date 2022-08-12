import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useField } from "remix-validated-form";
import { FormErrorMessage } from "./FormErrorMessage";

type Props = {
  name: string;
  items: { label: string; value: string }[];
};
export const FormRadio: React.VFC<Props> = ({ items, name }) => {
  const { getInputProps, error, defaultValue } = useField(name);

  return (
    <div>
      <RadioGroup
        row
        defaultValue={defaultValue ?? items[0].value}
        {...getInputProps()}
      >
        {items.map((item, i) => {
          return (
            <FormControlLabel
              key={i}
              value={item.value}
              control={<Radio />}
              label={item.label}
            />
          );
        })}
      </RadioGroup>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </div>
  );
};
