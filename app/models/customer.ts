import { Prisma } from "@prisma/client";
import { db } from "~/db.server";
import type { CustomerForm } from "~/forms/customerForm";
import { nullsToUndefineds } from "~/utils/nullToUndefined";
import type { Company } from "./company";
import { companyArgs } from "./company";
import type { Prefecture } from "./prefecture";
import { prefectureArgs } from "./prefecture";

export type Customer = {
  id: number;
  customerCd: string;
  name: string;
  kana: string;
  gender: number;
  zip?: string;
  address1?: string;
  address2?: string;
  phone: string;
  fax?: string;
  email: string;
  lasttrade?: Date;
  created: Date;
  modified: Date;

  company: Company;
  prefecture: Prefecture;
};

const customerArgs = Prisma.validator<Prisma.CustomerArgs>()({
  select: {
    id: true,
    customerCd: true,
    name: true,
    kana: true,
    gender: true,
    zip: true,
    address1: true,
    address2: true,
    phone: true,
    fax: true,
    email: true,
    lasttrade: true,
    created: true,
    modified: true,
    company: { ...companyArgs },
    prefecture: { ...prefectureArgs },
  },
});

const convertToCustomer = (
  rawCustomer: Prisma.CustomerGetPayload<typeof customerArgs>
): Customer => {
  const nullToUndefined = nullsToUndefineds(rawCustomer);
  return {
    ...nullToUndefined,
  };
};

const convertToCustomerForm = (
  rawCustomer: Prisma.CustomerGetPayload<typeof customerArgs>
): CustomerForm => {
  const customer = convertToCustomer(rawCustomer);

  return {
    ...customer,
    companyId: customer.company.id.toString(),
    prefectureId: customer.prefecture.id.toString(),
    lasttrade: customer.lasttrade?.toISOString(),
    gender: customer.gender.toString(),
  };
};

type FindCustomersArgs = Omit<
  Prisma.CustomerFindManyArgs,
  "select" | "include"
>;
export const findCustomers = async (
  args?: FindCustomersArgs
): Promise<Customer[]> => {
  const rawCustomers = await db.customer.findMany({ ...customerArgs, ...args });
  const customers = rawCustomers.map((raw) => convertToCustomer(raw));

  return customers;
};

type FindCustomerFormArgs = Omit<
  Prisma.CustomerFindUniqueArgs,
  "select" | "include"
>;
export const findCustomerForm = async (
  args: FindCustomerFormArgs
): Promise<CustomerForm | undefined> => {
  const rawCustomer = await db.customer.findUnique({
    ...customerArgs,
    ...args,
  });
  if (!rawCustomer) {
    return undefined;
  }

  return convertToCustomerForm(rawCustomer);
};

export const createCustomer = async (form: CustomerForm) => {
  await db.customer.create({
    data: {
      customerCd: form.customerCd,
      name: form.name,
      kana: form.kana,
      gender: Number(form.gender),
      company: { connect: { id: Number(form.companyId) } },
      zip: form.zip,
      prefecture: { connect: { id: Number(form.prefectureId) } },
      address1: form.address1,
      address2: form.address2,
      phone: form.phone,
      fax: form.fax,
      email: form.email,
      lasttrade: form.lasttrade !== "" ? form.lasttrade : undefined,
    },
  });
};

type UpdateCustomerArgs = { form: CustomerForm } & Omit<
  Prisma.CustomerUpdateArgs,
  "select" | "include" | "data"
>;
export const updateCustomer = async (args: UpdateCustomerArgs) => {
  const form = args.form;
  await db.customer.update({
    data: {
      customerCd: form.customerCd,
      name: form.name,
      kana: form.kana,
      gender: Number(form.gender),
      company: { connect: { id: Number(form.companyId) } },
      zip: form.zip,
      prefecture: { connect: { id: Number(form.prefectureId) } },
      address1: form.address1,
      address2: form.address2,
      phone: form.phone,
      fax: form.fax,
      email: form.email,
      lasttrade: form.lasttrade !== "" ? form.lasttrade : undefined,
    },
    where: args.where,
  });
};
