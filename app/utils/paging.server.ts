import type { PagingForm } from "~/forms/pagingForm";

type PaginateArgs<
  Countable extends { count: (arg: T) => Promise<number> },
  T
> = {
  input: T;
  pagingData: { form: PagingForm | undefined; limit: number };
  countable: Countable;
};
export const paginate = async <
  Countable extends { count: (arg: T) => Promise<number> },
  T
>({
  input,
  pagingData: { form, limit },
  countable,
}: PaginateArgs<Countable, T>) => {
  const currentPage = form ? form.page : 1;
  const findInput = { ...input, skip: (currentPage - 1) * limit, take: limit };

  const allItems = await countable.count(input);
  const allPages = Math.ceil(allItems / limit);
  return { findInput, allPages };
};
