import { z } from "zod";

export const sortCustomerFormSchema = z.object({
  orderBy: z.union([
    z.literal("customerCd"),
    z.literal("name"),
    z.literal("kana"),
    z.literal("company"),
    z.literal("prefecture"),
    z.literal("phone"),
    z.literal("email"),
  ]),
  order: z.union([z.literal("asc"), z.literal("desc")]),
});
