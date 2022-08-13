import {
  Box,
  Button,
  Card,
  CardContent,
  FormLabel,
  Typography,
} from "@mui/material";
import type { ActionArgs } from "@remix-run/node";
import {
  redirect,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";

import { ValidatedForm, validationError } from "remix-validated-form";
import { FileInput } from "~/components/FileInput";
import { clientImportCsvFormValidator } from "~/forms/clientImportCsvForm";
import { serverImportCsvFormValidator } from "~/forms/serverImportCsvForm.server";
import { importCustomersFromCsv } from "~/services/importCustomersFromCsv.server";

export const action = async ({ request }: ActionArgs) => {
  const uploadFileDirectory = "./public";
  const formData = await unstable_parseMultipartFormData(
    request,
    unstable_createFileUploadHandler({ directory: uploadFileDirectory })
  );

  const result = await serverImportCsvFormValidator.validate(formData);
  if (result.error) {
    return validationError(result.error);
  }
  const uploadedFilePath = uploadFileDirectory + "/" + result.data.file.name;
  await importCustomersFromCsv(uploadedFilePath, { removeAfter: true });

  return redirect("/customers");
};

export default function ImportCsv() {
  return (
    <div>
      <Typography variant="h5">顧客情報のインポート</Typography>
      <Box marginTop={3}>
        <Card>
          <CardContent>
            <ValidatedForm
              validator={clientImportCsvFormValidator}
              method="post"
              encType="multipart/form-data"
            >
              <FormLabel htmlFor="csvFile">CSVファイル</FormLabel>
              <Box marginTop={1}>
                <FileInput name="file" accept=".csv" id="csvFile" />
              </Box>
              <Box marginTop={3}>
                <Button variant="contained" type="submit">
                  インポート
                </Button>
              </Box>
            </ValidatedForm>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}
