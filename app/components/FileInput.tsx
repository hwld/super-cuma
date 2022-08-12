import { Box, Button, Stack, TextField } from "@mui/material";
import type { ComponentPropsWithoutRef } from "react";
import { useRef, useState } from "react";
import { useField } from "remix-validated-form";
import { FormErrorMessage } from "./FormErrorMessage";
type Props = {
  name: string;
  accept?: ComponentPropsWithoutRef<"input">["accept"];
  id?: string;
};
export const FileInput: React.VFC<Props> = ({ name, accept, id }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { error } = useField(name);
  const [fileName, setFileName] = useState("");

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleChangeFile: React.ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    setFileName(target.files?.[0]?.name ?? "");
  };

  return (
    <div>
      <Stack direction="row" marginTop={1}>
        <TextField
          size="small"
          placeholder="ファイルを選択してください"
          sx={{ caretColor: "transparent", width: "250px" }}
          value={fileName}
          onClick={openFileDialog}
          error={error !== undefined}
          autoComplete="off"
          id={id}
        />
        <Box marginLeft={"5px"} sx={{ display: "flex", alignItems: "center" }}>
          <Button variant="contained" onClick={openFileDialog}>
            選択
          </Button>
        </Box>
      </Stack>
      <input
        type="file"
        name={name}
        accept={accept}
        hidden
        ref={fileInputRef}
        onChange={handleChangeFile}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </div>
  );
};
