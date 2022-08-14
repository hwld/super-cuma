import {
  Box,
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
import { useLoaderData } from "@remix-run/react";
import { Pagination } from "~/components/Pagination";
import { db } from "~/db.server";
import { pagingFormSchema } from "~/forms/pagingForm";
import { buildSearchParamObject } from "~/libs/buildSearchParamObject";

type Avg = {
  customerName: string;
  avgPayment: number;
};

export const loader = async ({ request }: LoaderArgs) => {
  const searchParams = buildSearchParamObject(request.url);

  const limit = 10;
  let currentPage = 1;
  const pagingValid = pagingFormSchema.safeParse(searchParams);
  if (pagingValid.success) {
    currentPage = pagingValid.data.page;
  }

  const rawData = await db.$queryRaw<(Avg & { allCount: BigInt })[]>`
    WITH master AS (
      SELECT
        *
      FROM
        sale
        LEFT JOIN product
          ON(sale.productId = product.id)
        LEFT JOIN customer
          ON(sale.customerId = customer.id)
    )
    SELECT
      name AS customerName
      , AVG(amount * unitPrice) as avgPayment
      , allCount
    FROM
      master
      CROSS JOIN (
        SELECT
          COUNT(DISTINCT name) AS allCount
        FROM
          master
      )
    GROUP BY
      name
    ORDER BY
      avgPayment DESC
    LIMIT ${limit}
    OFFSET ${(currentPage - 1) * limit}
  `;
  const avgCustomerSpend: Avg[] = rawData.map((raw) => {
    const { allCount, ...avgData } = raw;
    return { ...avgData };
  });

  const allPages = Math.ceil(Number(rawData[0].allCount) / limit);

  return json({ avgCustomerSpend, allPages });
};

export default function AVG() {
  const { avgCustomerSpend, allPages } = useLoaderData<typeof loader>();

  return (
    <div>
      <Typography variant="h5">平均客単価</Typography>
      <Box marginTop={3}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>顧客名</TableCell>
                <TableCell>平均客単価</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {avgCustomerSpend.map((avg, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell>{avg.customerName}</TableCell>
                    <TableCell>{avg.avgPayment}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack alignItems="center" marginTop={1}>
          <Pagination allPages={allPages} />
        </Stack>
      </Box>
    </div>
  );
}
