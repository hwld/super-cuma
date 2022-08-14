import { pagingFormSchema } from "~/forms/pagingForm";
import { buildSearchParamObject } from "~/libs/buildSearchParamObject";

export const buildUsersRequest = async (request: Request) => {
  const searchParams = buildSearchParamObject(request.url);

  const pagingValid = pagingFormSchema.safeParse(searchParams);
  const pagingForm = pagingValid.success ? pagingValid.data : undefined;

  return { pagingForm };
};
