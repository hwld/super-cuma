import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const customerSearchFormSchema = z.object({
  customerCd: z.string().optional(),
  name: z.string().optional(),
  kana: z.string().optional(),
  companyName: z.string().optional(),
  prefectureId: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  lasttradeStart: z.string().optional(),
  lasttradeEnd: z.string().optional(),
});

export type CustomerSearchForm = z.infer<typeof customerSearchFormSchema>;

export const customerSearchValidator = withZod(customerSearchFormSchema);
