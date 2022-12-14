import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import { useControlField, useField } from "remix-validated-form";

type Props = {
  size: "medium" | "small";
  name: string;
  label?: string;
  id?: string;
  items: { label: string; value: string }[];
};
export const FormAutoComplete: React.VFC<Props> = ({
  size,
  name,
  label,
  id,
  items,
}) => {
  const { error, validate } = useField(name);
  const [inputValue, setInputValue] = useControlField<string | undefined>(name);

  const [item, setItem] = useState<{ label: string; value: string }>(
    items.find(({ value }) => value === inputValue) ?? items[0]
  );

  return (
    <>
      <Autocomplete
        id={id}
        size={size}
        options={items}
        isOptionEqualToValue={(opt, value) => {
          return opt.label === value.label && opt.value === value.value;
        }}
        onChange={(_, item) => {
          setItem(item ?? items[0]);
          setInputValue(item?.value ?? "");
          validate();
        }}
        value={item}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              label={label}
              error={error !== undefined}
              helperText={error}
            />
          );
        }}
      />
      <input hidden value={inputValue ?? items[0].value} readOnly name={name} />
    </>
  );
};
