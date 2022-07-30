import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { CustomerForm } from "~/components/CustomerForm";
import { customerValidator } from "~/forms/customerForm";
import { findCompanies } from "~/models/company";
import { createCustomer } from "~/models/customer";
import { findPrefectures } from "~/models/prefecture";

export const loader = async () => {
  const companies = await findCompanies();
  const prefectures = await findPrefectures();

  return json({ companies, prefectures });
};

export const action = async ({ request }: ActionArgs) => {
  const result = await customerValidator.validate(await request.formData());

  if (result.error) {
    return validationError(result.error);
  }

  await createCustomer(result.data);
  return redirect("/customers");
};

export default function Add() {
  const { companies, prefectures } = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="mb-4">顧客登録</h3>
      <CustomerForm companies={companies} prefectures={prefectures} />
    </div>
  );
}
