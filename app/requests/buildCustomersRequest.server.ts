import type { CustomerSearchForm } from "~/forms/customerSearchForm";
import { customerSearchFormSchema } from "~/forms/customerSearchForm";
import type { PagingForm } from "~/forms/pagingForm";
import { pagingFormSchema } from "~/forms/pagingForm";
import type { SortCustomerForm } from "~/forms/sortCustomerForm";
import { sortCustomerFormSchema } from "~/forms/sortCustomerForm";
import { buildSearchParamObject } from "~/libs/buildSearchParamObject";

export type CustomersRequest = {
  searchForm?: CustomerSearchForm;
  pagingForm?: PagingForm;
  sortForm?: SortCustomerForm;
};
export const buildCustomersRequest = (request: Request): CustomersRequest => {
  const searchParams = buildSearchParamObject(request.url);

  // 検索フォーム
  const searchFormValidResult =
    customerSearchFormSchema.safeParse(searchParams);
  const searchForm = searchFormValidResult.success
    ? searchFormValidResult.data
    : undefined;

  // ページングフォーム
  const pagingFormValidResult = pagingFormSchema.safeParse(searchParams);
  const pagingForm = pagingFormValidResult.success
    ? pagingFormValidResult.data
    : undefined;

  // ソートフォーム
  const sortFormValidResult = sortCustomerFormSchema.safeParse(searchParams);
  const sortForm = sortFormValidResult.success
    ? sortFormValidResult.data
    : undefined;

  return { searchForm, pagingForm, sortForm };
};
