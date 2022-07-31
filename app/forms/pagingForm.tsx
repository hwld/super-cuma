import { z } from "zod";

export const pagingFormSchema = z.object({ page: z.string() });
