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
      <Typography marginTop={3} variant="h5">
        顧客一覧
      </Typography>
      <Box marginTop={3}>
        <SearchCustomerForm prefectures={prefectures} method="get" />
      </Box>
      {user.isAdmin && (
        <Stack direction="row" justifyContent="flex-end" gap={1} marginTop={3}>
          <Button variant="contained" component={Link} to="importCsv">
            インポート
          </Button>
          <Button
            variant="contained"
            component={Link}
            to="exportCsv"
            reloadDocument
          >
            エクスポート
          </Button>
          <Button variant="contained" component={Link} to="add">
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
                            variant="contained"
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
                              <Button
                                type="submit"
                                variant="contained"
                                size="small"
                              >
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
      <Box
        marginTop={1}
        textAlign={"center"}
        display={"flex"}
        justifyContent={"center"}
      >
        <Pagination allPages={allPages} />
      </Box>
    </div>
  );
}
