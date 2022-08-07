import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const userFormSchema = z
  .object({
    username: z.string().min(1, "ユーザー名は1文字以上入力してください"),
    password: z.string().min(1, "パスワードは1文字以上入力してください"),
    isAdmin: z
      .union([
        z.literal("false"),
        //　trueとfalseのタプルの場合にtrueとみなす。
        // これは、undefinedとfalseを区別するために、
        // Checkboxコンポーネントでは常にinput hiddenでfalseをセットしているため。
        // 例えば管理者でないユーザーが自分を編集する際には、isAdminを変更するためのinputを許可しないので、
        // udnefinedになる。
        z.tuple([z.literal("true"), z.literal("false")]),
      ])
      .optional()
      .transform((val) => {
        if (val === "false") {
          return false;
        }
        if (val === undefined) {
          return undefined;
        }
        if (val[0] === "true") {
          return true;
        }
        return undefined;
      }),
  })
  .strict();

export type UserForm = z.infer<typeof userFormSchema>;

export const userFormValidator = withZod(userFormSchema);
