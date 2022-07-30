import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { CustomerForm } from "~/components/CustomerForm";
import { customerValidator } from "~/forms/customerForm";
import { findCompanies } from "~/models/company";
import { findCustomerForm, updateCustomer } from "~/models/customer";
import { findPrefectures } from "~/models/prefecture";

export const loader = async ({ params }: LoaderArgs) => {
  if (typeof params.id !== "string") {
    throw new Error("不正なリクエストです");
  }
  const customerId = Number(params.id);

  const companies = await findCompanies();
  const prefectures = await findPrefectures();
  const customerForm = await findCustomerForm({ where: { id: customerId } });

  return json({ companies, prefectures, customerForm });
};

export const action = async ({ request, params }: ActionArgs) => {
  if (typeof params.id !== "string") {
    throw new Error("不正なリクエストです");
  }
  const customerId = Number(params.id);

  const result = await customerValidator.validate(await request.formData());
  if (result.error) {
    return validationError(result.error);
  }

  await updateCustomer({ form: result.data, where: { id: customerId } });
  return redirect("/customers");
};

export default function EditCustomer() {
  const { companies, prefectures, customerForm } =
    useLoaderData<typeof loader>();

  return (
    <div>
      <h3>顧客編集</h3>
      <CustomerForm
        companies={companies}
        prefectures={prefectures}
        defaultValues={customerForm}
      />
    </div>
  );
}
