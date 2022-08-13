import { MenuItem, Select } from "@mui/material";
import { useField } from "remix-validated-form";
import { FormErrorMessage } from "./FormErrorMessage";

type Props = {
  id: string;
  name: string;
  items: { label: string; value: string | number | undefined }[];
  size?: "small" | "medium";
};
export const FormSelect: React.VFC<Props> = ({
  id,
  name,
  items,
  size = "medium",
}) => {
  const { error, defaultValue } = useField(name);

  return (
    <div>
      <Select
        size={size}
        fullWidth
        name={name}
        defaultValue={defaultValue ?? items[0].value}
      >
        {items.map((item, i) => {
          return (
            <MenuItem key={i} value={item.value}>
              {item.label}
            </MenuItem>
          );
        })}
      </Select>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </div>
  );
};
