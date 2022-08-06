import { NodeOnDiskFile } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const serverImportCsvFormValidator = withZod(
  z.object({
    file: z.preprocess(
      (val) => {
        return val instanceof NodeOnDiskFile && val.size === 0
          ? undefined
          : val;
      },
      z.instanceof(NodeOnDiskFile, {
        message: "ファイルを選択してください",
      })
    ),
  })
);
