import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { CustomerForm } from "~/components/CustomerForm";
import { customerValidator } from "~/forms/customerForm";
import { findCompanies } from "~/models/company/finder.server";
import { createCustomer } from "~/models/customer/finder.server";
import { findPrefectures } from "~/models/prefecture/finder.server";
import { requireAuthentication } from "~/services/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  await requireAuthentication(request, (user) => user.isAdmin);

  const companies = await findCompanies();
  const prefectures = await findPrefectures();

  return json({ companies, prefectures });
};

export const action = async ({ request }: ActionArgs) => {
  await requireAuthentication(request, (user) => user.isAdmin);

  const result = await customerValidator.validate(await request.formData());

  if (result.error) {
    return validationError(result.error);
  }

  await createCustomer(result.data);
  return redirect("/customers");
};

export default function Add() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="mb-4">顧客登録</h3>
      <CustomerForm
        companies={loaderData?.companies ?? []}
        prefectures={loaderData?.prefectures ?? []}
      />
    </div>
  );
}
