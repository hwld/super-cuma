import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
export const customerFormSchema = z
  .object({
    customerCd: z
      .string()
      .min(1, "1文字以上入力してください")
      .max(10, "10文字以下で入力してください")
      .regex(/^[0-9]+$/, "半角数字を入力してください"),
    name: z
      .string()
      .min(1, "1文字以上で入力してください")
      .max(50, "50文字以下で入力してください"),
    kana: z
      .string()
      .min(1, "1文字以上で入力してください")
      .max(50, "50文字以下で入力してください"),
    // 1男 2女
    gender: z.string().regex(/[12]/, "1(男)または2(女)で入力してください"),
    companyId: z.string().min(1, "会社を選択してください"),
    zip: z.string().max(10, "10文字以下で入力してください").optional(),
    prefectureId: z.string().min(1, "都道府県を選択してください"),
    address1: z.string().optional(),
    address2: z.string().optional(),
    phone: z
      .string()
      .regex(
        /^\d{1,4}-\d{1,4}-\d{4}$/,
        "ハイフン区切りの電話番号を入力してください"
      ),
    fax: z
      .string()
      .refine((val) => val === "" || /^\d{1,4}-\d{1,4}-\d{4}$/.test(val), {
        message: "ハイフン区切りのFAX番号を入力してください",
      })
      .optional(),

    email: z.string().email("メールアドレスを入力してください"),
    lasttrade: z
      .string()
      .refine((val) => val === "" || /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(val), {
        message: "yyyy-mm-dd形式の日付を入力してください",
      })
      .optional(),
  })
  .strict();

export type CustomerForm = z.infer<typeof customerFormSchema>;

export const customerValidator = withZod(customerFormSchema);
