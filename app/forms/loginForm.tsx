import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const loginFormSchema = z.object({
  username: z.string().min(1, "1文字以上入力してください"),
  password: z.string().min(1, "1文字以上入力してください"),
});

export const loginFormValidator = withZod(loginFormSchema);
