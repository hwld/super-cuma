import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { Button, Table } from "react-bootstrap";
import { Pagination } from "~/components/Pagination";
import { SearchCustomerForm } from "~/components/SearchCustomerForm";
import { SortableTh } from "~/components/SortableTh";
import { useSortCustomerState } from "~/libs/useSortCustomerState";
import type { Customer } from "~/models/customer";
import { findCustomersByRequest } from "~/models/customer/finder.server";
import { findPrefectures } from "~/models/prefecture/finder.server";
import { buildCustomersRequest } from "~/requests/buildCustomersRequest.server";
import { requireAuthentication } from "~/services/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireAuthentication(request);

  const customersRequest = buildCustomersRequest(request);

  const { customers, allPages } = await findCustomersByRequest(
    customersRequest
  );

  const prefectures = await findPrefectures();

  return json({ customers, prefectures, allPages, user });
};

export default function Index() {
  const { customers, prefectures, allPages, user } =
    useLoaderData<typeof loader>();
  const fetcher = useFetcher();

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
      {user.isAdmin && (
        <div className="text-end">
          <Link to="importCsv" className="btn btn-secondary me-1">
            インポート
          </Link>
          <Link
            to="exportCsv"
            className="btn btn-secondary me-1"
            reloadDocument
          >
            エクスポート
          </Link>
          <Link to="add" className="btn btn-primary">
            新規登録
          </Link>
        </div>
      )}
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
            {user.isAdmin && <th className="user-select-none">更新・削除</th>}
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
                {user.isAdmin && (
                  <td>
                    <div className="d-flex gap-1">
                      <Link
                        to={`/customers/edit/${customer.id}`}
                        className="btn btn-success btn-sm"
                      >
                        更新
                      </Link>
                      <fetcher.Form
                        action={`delete/${customer.id}`}
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
                      </fetcher.Form>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Pagination allPages={allPages} />
    </div>
  );
}
