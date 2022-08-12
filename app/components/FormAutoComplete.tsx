import { Autocomplete, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useControlField, useField } from "remix-validated-form";

type Props = {
  size: "medium" | "small";
  name: string;
  label?: string;
  id?: string;
  items: { label: string; value: string }[];
  allowEmpty?: boolean;
};
export const FormAutoComplete: React.VFC<Props> = ({
  size,
  name,
  label,
  id,
  items,
  allowEmpty = false,
}) => {
  const { error, validate } = useField(name);
  const [inputValue, setInputValue] = useControlField<string | undefined>(name);

  const defaultItem = useMemo(
    () => (allowEmpty ? { label: "", value: "" } : items[0]),
    [allowEmpty, items]
  );
  const [item, setItem] = useState<{ label: string; value: string }>(
    items.find(({ value }) => value === inputValue) ?? defaultItem
  );

  const options = useMemo(() => {
    if (allowEmpty) {
      return [defaultItem, ...items];
    }
    return items;
  }, [allowEmpty, defaultItem, items]);

  return (
    <>
      <Autocomplete
        id={id}
        size={size}
        options={options}
        isOptionEqualToValue={(opt, value) => {
          return opt.label === value.label && opt.value === value.value;
        }}
        onChange={(_, item) => {
          setItem(item ?? defaultItem);
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
      <input hidden value={inputValue ?? ""} readOnly name={name} />
    </>
  );
};
