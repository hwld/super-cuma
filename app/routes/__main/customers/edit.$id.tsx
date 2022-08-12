import { Box, Typography } from "@mui/material";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { CustomerForm } from "~/components/CustomerForm";
import { customerValidator } from "~/forms/customerForm";
import { findCompanies } from "~/models/company/finder.server";
import {
  findCustomerForm,
  updateCustomer,
} from "~/models/customer/finder.server";
import { findPrefectures } from "~/models/prefecture/finder.server";
import { requireAuthentication } from "~/services/auth.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  await requireAuthentication(request, (user) => user.isAdmin);

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
  await requireAuthentication(request, (user) => user.isAdmin);

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
      <Typography variant="h5">顧客編集</Typography>
      <Box marginTop={3}>
        <CustomerForm
          companies={companies}
          prefectures={prefectures}
          defaultValues={customerForm}
        />
      </Box>
    </div>
  );
}
