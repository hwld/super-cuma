import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import { db } from "~/db.server";
import type { CustomerForm } from "~/forms/customerForm";
import type { CustomerSearchForm } from "~/forms/customerSearchForm";
import type { SortCustomerForm } from "~/forms/sortCustomerForm";
import { emptyToUndefined } from "~/utils/emptyToUndefined";
import { nullsToUndefineds } from "~/utils/nullToUndefined";
import type { Customer } from ".";
import { companyArgs } from "../company/finder.server";
import { prefectureArgs } from "../prefecture/finder.server";

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
    lasttrade: customer.lasttrade
      ? format(new Date(customer.lasttrade), "yyyy-MM-dd")
      : undefined,
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

  const customerForm = convertToCustomerForm(rawCustomer);

  return customerForm;
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
      lasttrade:
        // lasttrade???yyyy-mm-dd???????????????????????????????????????????????????????????????????????????
        // ???????????????????????????????????????????????????????????????
        // ???????????????????????????????????????????????????????????????
        // UTC???????????????JST?????????????????????????????????????????????????????????????????????????????????
        form.lasttrade !== "" && form.lasttrade !== undefined
          ? new Date(form.lasttrade).toISOString()
          : undefined,
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
      lasttrade:
        form.lasttrade !== "" && form.lasttrade !== undefined
          ? new Date(form.lasttrade).toISOString()
          : undefined,
    },
    where: args.where,
  });
};

export const buildCustomersSearchInput = (
  searchForm: CustomerSearchForm | undefined
): { where: Prisma.CustomerWhereInput } | undefined => {
  if (searchForm === undefined) {
    return undefined;
  }

  //????????????undefined???????????????
  const searchParam = emptyToUndefined(searchForm);

  return {
    where: {
      customerCd: { contains: searchParam.customerCd },
      name: { contains: searchParam.name },
      kana: { contains: searchParam.kana },
      company: { companyName: { contains: searchParam.companyName } },
      prefecture: {
        id: searchParam.prefectureId
          ? Number(searchParam.prefectureId)
          : undefined,
      },
      phone: { contains: searchParam.phone },
      email: { contains: searchParam.email },
      lasttrade: {
        gte: searchParam.lasttradeStart
          ? new Date(searchParam.lasttradeStart)
          : undefined,
        lte: searchParam.lasttradeEnd
          ? new Date(searchParam.lasttradeEnd)
          : undefined,
      },
    },
  };
};

export const buildCustomersSortInput = (
  sortForm: SortCustomerForm | undefined
): { orderBy: Prisma.CustomerFindManyArgs["orderBy"] } | undefined => {
  if (sortForm === undefined) {
    return undefined;
  }

  const { orderBy, order } = sortForm;
  if (orderBy === "company") {
    return { orderBy: { company: { companyName: order } } };
  } else if (orderBy === "prefecture") {
    return { orderBy: { prefecture: { prefName: order } } };
  } else {
    return { orderBy: { [orderBy]: order } };
  }
};
