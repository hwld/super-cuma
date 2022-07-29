import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { CustomerForm } from "~/components/CustomerForm";
import { db } from "~/db.server";
import { customerValidator } from "~/forms/customerForm";

export const loader = async () => {
  const companies = await db.company.findMany({
    select: { id: true, companyName: true },
  });
  const prefectures = await db.prefecture.findMany({
    select: { id: true, prefName: true },
  });

  return json({ companies, prefectures });
};

export const action = async ({ request }: ActionArgs) => {
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

  await db.customer.create({
    data: {
      customerCd,
      name,
      kana,
      gender: parseInt(gender),
      company: { connect: { id: parseInt(companyId) } },
      zip,
      prefecture: { connect: { id: parseInt(prefectureId) } },
      address1,
      address2,
      phone,
      fax,
      email,
      lasttrade: lasttrade !== "" ? lasttrade : null,
    },
  });

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
