import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { Pagination } from "~/components/Pagination";
import { SearchCustomerForm } from "~/components/SearchCustomerForm";
import { SortableTh } from "~/components/SortableTh";
import { db } from "~/db.server";
import { useSortCustomerState } from "~/libs/useSortCustomerState";
import type { Customer } from "~/models/customer";
import {
  buildCustomersSearchInput,
  buildCustomersSortInput,
  findCustomers,
} from "~/models/customer/finder.server";
import { findPrefectures } from "~/models/prefecture/finder.server";
import { buildCustomersRequest } from "~/requests/customers.server";
import { requireAuthentication } from "~/services/auth.server";
import { paginate } from "~/utils/paging.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireAuthentication(request);

  // requestから、処理に必要なformDataを抽出する
  const { searchForm, sortForm, pagingForm } = buildCustomersRequest(request);

  // searchForm,sortFormから、検索、並び替えに必要なfindへの入力を組み立てる
  const searchInput = buildCustomersSearchInput(searchForm);
  const sortInput = buildCustomersSortInput(sortForm);

  // findへのすべての入力と、pagingForm、1ページの最大件数などを渡して、
  // findへの最終的な入力と、全ページ数を取得する
  // 全ページ数を取得するには、すべてのデータを数える必要があるので、countを呼び出せるオブジェクトを
  // 渡す。
  // ここではdb.customerを渡すことによって、渡された入力に該当するcustomerの数を求めることができる。
  const limit = 10;
  const { findInput, allPages } = await paginate({
    input: { ...searchInput, ...sortInput },
    pagingData: { form: pagingForm, limit },
    countable: db.customer,
  });

  const customers = await findCustomers({ ...findInput });
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
      <Typography variant="h5">顧客一覧</Typography>
      <Box marginTop={3}>
        <SearchCustomerForm prefectures={prefectures} method="get" />
      </Box>
      {user.isAdmin && (
        <Stack direction="row" justifyContent="flex-end" gap={1} marginTop={3}>
          <Button component={Link} to="importCsv">
            インポート
          </Button>
          <Button component={Link} to="exportCsv" reloadDocument>
            エクスポート
          </Button>
          <Button component={Link} to="add">
            新規登録
          </Button>
        </Stack>
      )}
      <Box marginTop={2}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
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
                {user.isAdmin && <TableCell>更新・削除</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => {
                return (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.customerCd}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.kana}</TableCell>
                    <TableCell>{customer.company.companyName}</TableCell>
                    <TableCell>{customer.prefecture.prefName}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    {user.isAdmin && (
                      <TableCell>
                        <Stack direction="row" gap={1} alignItems="center">
                          <Button
                            component={Link}
                            to={`/customers/edit/${customer.id}`}
                            size="small"
                          >
                            更新
                          </Button>
                          <Box>
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
                              <Button type="submit" size="small">
                                削除
                              </Button>
                            </fetcher.Form>
                          </Box>
                        </Stack>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Stack marginTop={1} alignItems="center">
        <Pagination allPages={allPages} />
      </Stack>
    </div>
  );
}
