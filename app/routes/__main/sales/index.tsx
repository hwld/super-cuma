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
import { Link, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { Pagination } from "~/components/Pagination";
import { db } from "~/db.server";
import { pagingFormSchema } from "~/forms/pagingForm";
import { buildSearchParamObject } from "~/libs/buildSearchParamObject";
import type { Sale } from "../../../models/sale";

export const loader = async ({ request }: LoaderArgs) => {
  const searchParams = buildSearchParamObject(request.url);

  // prismaは計算された列での並び替えをサポートしていないので
  // SQLを直接書く
  // LIMIT, OFFSETが使えないDBのことは考えない

  const limit = 10;
  let currentPage = 1;
  const pagingValid = pagingFormSchema.safeParse(searchParams);
  if (pagingValid.success) {
    currentPage = pagingValid.data.page;
  }

  const fromQuery = `
    FROM
      sale
    LEFT JOIN product
      ON (sale.productId = product.id)
    LEFT JOIN customer
      ON (sale.customerId = customer.id)
    LEFT JOIN company
      ON (customer.companyId = company.id)
  `;

  const rawData = await db.$queryRawUnsafe<
    (Omit<Sale, "revenue"> & { revenue: BigInt })[]
  >(`
    SELECT
      customer.name AS customerName
      , companyName
      , address1 AS address
      , productName
      , purchaseDate AS purchaseData
      , amount
      , unitPrice
      , amount * unitPrice AS revenue
    ${fromQuery}
    ORDER BY 
      revenue DESC
    LIMIT ${limit}
    OFFSET ${(currentPage - 1) * limit}
  `);

  const sales: Sale[] = rawData.map((raw) => ({
    ...raw,
    revenue: Number(raw.revenue),
  }));

  const allSalesCount = await db.$queryRawUnsafe<{ count: BigInt }[]>(`
    SELECT
      COUNT(*) as count
    ${fromQuery}
  `);

  const allItems = Number(allSalesCount[0].count);
  const allPages = Math.ceil(allItems / limit);

  return json({ sales, allPages });
};

export default function SalesHome() {
  const { sales, allPages } = useLoaderData<typeof loader>();

  return (
    <div>
      <Typography variant="h5">売上一覧</Typography>
      <Box marginTop={3}>
        <Button
          variant="contained"
          component={Link}
          to="pdf"
          reloadDocument
          target="_blank"
        >
          帳票出力
        </Button>
      </Box>
      <Box marginTop={1}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>"顧客名"</TableCell>
                <TableCell>"会社名"</TableCell>
                <TableCell>"住所"</TableCell>
                <TableCell>"製品名"</TableCell>
                <TableCell>"購入日"</TableCell>
                <TableCell>"個数"</TableCell>
                <TableCell>"単価"</TableCell>
                <TableCell>"金額"</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell>{sale.customerName}</TableCell>
                    <TableCell>{sale.companyName}</TableCell>
                    <TableCell>{sale.address}</TableCell>
                    <TableCell>{sale.productName}</TableCell>
                    <TableCell>
                      {format(new Date(sale.purchaseData), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell>{sale.amount}</TableCell>
                    <TableCell>{sale.unitPrice}</TableCell>
                    <TableCell>{sale.revenue}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack marginTop={1} alignItems="center">
          <Pagination allPages={allPages} />
        </Stack>
      </Box>
    </div>
  );
}
