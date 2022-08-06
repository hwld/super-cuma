import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const clientImportCsvFormValidator = withZod(
  z.object({
    file: z.preprocess((val) => {
      return val instanceof File && val.size === 0 ? undefined : val;
    }, z.instanceof(File, { message: "ファイルを選択してください。" })),
  })
);
