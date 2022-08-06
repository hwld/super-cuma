import type { ActionArgs } from "@remix-run/node";
import {
  redirect,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Button } from "react-bootstrap";
import { ValidatedForm, validationError } from "remix-validated-form";
import { FormInput } from "~/components/FormInput";
import { FormLabel } from "~/components/FormLabel";
import { HorizontalFormRow } from "~/components/HorizontalFormRow";
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
      <h3>顧客情報のインポート</h3>
      <ValidatedForm
        validator={clientImportCsvFormValidator}
        className="mt-3"
        method="post"
        encType="multipart/form-data"
      >
        <HorizontalFormRow
          label={<FormLabel text="CSVファイル:" htmlFor="file" />}
          input={<FormInput type="file" name="file" id="file" accept=".csv" />}
        />

        <div className="mt-3 text-end">
          <Button type="submit">インポート</Button>
        </div>
      </ValidatedForm>
    </div>
  );
}
