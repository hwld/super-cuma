import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const userFormSchema = z
  .object({
    username: z.string().min(1, "ユーザー名は1文字以上入力してください"),
    password: z.string().min(1, "パスワードは1文字以上入力してください"),
    isAdmin: z.literal("true").optional(),
  })
  .strict();

export type UserForm = z.infer<typeof userFormSchema>;

export const userFormValidator = withZod(userFormSchema);
