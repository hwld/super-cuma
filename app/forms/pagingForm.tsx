import { z } from "zod";

export const pagingFormSchema = z.object({
  page: z.string().transform((val) => {
    const page = Number(val);
    if (isNaN(page)) {
      return 0;
    }
    return page;
  }),
});
export type PagingForm = z.infer<typeof pagingFormSchema>;
