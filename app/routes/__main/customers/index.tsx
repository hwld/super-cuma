import type { Prisma } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { Button, Table } from "react-bootstrap";
import { Pagination } from "~/components/Pagination";
import { SearchCustomerForm } from "~/components/SearchCustomerForm";
import { SortableTh } from "~/components/SortableTh";
import { db } from "~/db.server";
import { customerSearchFormSchema } from "~/forms/customerSearchForm";
import { pagingFormSchema } from "~/forms/pagingForm";
import { sortCustomerFormSchema } from "~/forms/sortCustomerForm";
import { useSortCustomerState } from "~/libs/useSortCustomerState";
import type { Customer } from "~/models/customer";
import { buildCustomersWhere, findCustomers } from "~/models/customer";
import { findPrefectures } from "~/models/prefecture";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const searchParams = Object.fromEntries(url.searchParams.entries());
  const validResult = customerSearchFormSchema.safeParse(searchParams);

  let findCustomersWhere: Prisma.CustomerWhereInput | undefined = undefined;
  if (validResult.success) {
    findCustomersWhere = buildCustomersWhere(validResult.data);
  }

  // ページング
  const limit = 3;
  let currentPage = 1;

  const pagingFormValidResult = pagingFormSchema.safeParse(searchParams);
  if (pagingFormValidResult.success) {
    const page = Number(pagingFormValidResult.data.page);
    if (!isNaN(page)) {
      currentPage = page;
    }
  }

  // ソート
  let orderBy:
    | Prisma.Enumerable<Prisma.CustomerOrderByWithRelationInput>
    | undefined = undefined;
  const sortFormValidResult = sortCustomerFormSchema.safeParse(searchParams);
  if (sortFormValidResult.success) {
    const sortData = sortFormValidResult.data;
    if (sortData.orderBy === "company") {
      orderBy = { company: { companyName: sortData.order } };
    } else if (sortData.orderBy === "prefecture") {
      orderBy = { prefecture: { prefName: sortData.order } };
    } else {
      orderBy = { [sortData.orderBy]: sortData.order };
    }
  }

  const customers = await findCustomers({
    where: findCustomersWhere,
    skip: (currentPage - 1) * limit,
    take: limit,
    orderBy,
  });
  const prefectures = await findPrefectures();

  const allCustomersCount = await db.customer.count({
    where: findCustomersWhere,
  });
  const allPages = Math.ceil(allCustomersCount / limit);

  return json({ customers, prefectures, allPages });
};

export const action = async ({ request }: ActionArgs) => {
  if (request.method === "DELETE") {
    const formData = await request.formData();
    const id = formData.get("customerId");
    if (typeof id !== "string") {
      throw new Error("フォームが正しく送信されませんでした。");
    }

    await db.customer.delete({ where: { id: parseInt(id) } });
  }
  return json(null);
};

export default function Index() {
  const { customers, prefectures, allPages } = useLoaderData<typeof loader>();

  const sortableHeaders: { field: keyof Customer; name: string }[] = [
    { field: "customerCd", name: "顧客コード" },
    { field: "name", name: "顧客名" },
    { field: "kana", name: "顧客名(カナ)" },
    { field: "company", name: "会社名" },
    { field: "prefecture", name: "都道府県" },
    { field: "phone", name: "電話番号" },
    { field: "email", name: "Email" },
  ];

  const [sortState, setSearchParam] = useSortCustomerState({
    defaultValue: { orderBy: "", order: "asc" },
  });

  return (
    <div>
      <h3 className="mb-3">顧客一覧</h3>
      <div className="mb-3">
        <SearchCustomerForm prefectures={prefectures} method="get" />
      </div>
      <div className="text-end">
        <Link to="add" className="btn btn-primary">
          新規登録
        </Link>
      </div>
      <Table>
        <thead>
          <tr>
            {sortableHeaders.map(({ field, name }) => {
              return (
                <SortableTh
                  key={field}
                  field={field}
                  sortState={sortState}
                  setSortState={setSearchParam}
                >
                  {name}
                </SortableTh>
              );
            })}
            <th className="user-select-none">更新・削除</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => {
            return (
              <tr key={customer.id}>
                <td>{customer.customerCd}</td>
                <td>{customer.name}</td>
                <td>{customer.kana}</td>
                <td>{customer.company.companyName}</td>
                <td>{customer.prefecture.prefName}</td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>
                  <div className="d-flex gap-1">
                    <Link
                      to={`/customers/edit/${customer.id}`}
                      className="btn btn-success btn-sm"
                    >
                      更新
                    </Link>
                    <Form
                      method="delete"
                      onSubmit={(e) => {
                        const result = window.confirm(
                          `顧客名: ${customer.name} を削除しても良いですか?`
                        );
                        if (!result) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input
                        hidden
                        name="customerId"
                        defaultValue={customer.id}
                      />
                      <Button type="submit" className="btn btn-danger btn-sm">
                        削除
                      </Button>
                    </Form>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Pagination allPages={allPages} />
    </div>
  );
}
