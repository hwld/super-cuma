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
  const searchFormValid = customerSearchFormSchema.safeParse(searchParams);
  const searchForm = searchFormValid.success ? searchFormValid.data : undefined;

  // ページングフォーム
  const pagingFormValid = pagingFormSchema.safeParse(searchParams);
  const pagingForm = pagingFormValid.success ? pagingFormValid.data : undefined;

  // ソートフォーム
  const sortFormValid = sortCustomerFormSchema.safeParse(searchParams);
  const sortForm = sortFormValid.success ? sortFormValid.data : undefined;

  return { searchForm, pagingForm, sortForm };
};
