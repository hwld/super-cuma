import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { CustomerForm } from "~/components/CustomerForm";
import { db } from "~/db.server";
import { customerValidator } from "~/forms/customerForm";
import { nullsToUndefined } from "~/utils/nullToUndefined";

export const loader = async ({ params }: LoaderArgs) => {
  if (typeof params.id !== "string") {
    throw new Error("不正なリクエストです");
  }
  const customerId = Number(params.id);

  const companies = await db.company.findMany({
    select: { id: true, companyName: true },
  });
  const prefectures = await db.prefecture.findMany({
    select: { id: true, prefName: true },
  });
  const rawCustomer = await db.customer.findUnique({
    where: { id: customerId },
  });
  const customer = {
    ...rawCustomer,
    gender: rawCustomer?.gender.toString(),
    companyId: rawCustomer?.companyId.toString(),
    prefectureId: rawCustomer?.prefectureId.toString(),
  };

  return json({ companies, prefectures, customer: nullsToUndefined(customer) });
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

  const {
    customerCd,
    name,
    kana,
    gender,
    companyId,
    zip,
    prefectureId,
    address1,
    address2,
    phone,
    fax,
    email,
    lasttrade,
  } = result.data;
  await db.customer.update({
    data: {
      customerCd,
      name,
      kana,
      gender: Number(gender),
      company: { connect: { id: Number(companyId) } },
      zip,
      prefecture: { connect: { id: Number(prefectureId) } },
      address1,
      address2,
      phone,
      fax,
      email,
      lasttrade: lasttrade !== "" ? lasttrade : null,
    },
    where: { id: customerId },
  });

  return redirect("/customers");
};

export default function EditCustomer() {
  const { companies, prefectures, customer } = useLoaderData<typeof loader>();

  return (
    <div>
      <h3>顧客編集</h3>
      <CustomerForm
        companies={companies}
        prefectures={prefectures}
        defaultValues={customer}
      />
    </div>
  );
}
