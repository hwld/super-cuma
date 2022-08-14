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

type RawSalesRanking = {
  productName: string;
  unitPrice: number;
  sumAmount: BigInt;
  sumSales: number;
  ranking: BigInt;
};
type SalesRanking = Omit<RawSalesRanking, "sumAmount" | "ranking"> & {
  sumAmount: number;
  ranking: number;
};

export const loader = async ({ request }: LoaderArgs) => {
  const searchParams = buildSearchParamObject(request.url);

  const limit = 10;
  let currentPage = 1;
  const pagingValid = pagingFormSchema.safeParse(searchParams);
  if (pagingValid.success) {
    currentPage = pagingValid.data.page;
  }

  const rawData = await db.$queryRaw<
    (RawSalesRanking & { allCount: BigInt })[]
  >`
    SELECT
      productName
      , AVG(unitPrice) AS unitPrice
      , SUM(amount) AS sumAmount
      , AVG(unitPrice) * SUM(amount) AS sumSales
      , RANK() OVER (
        ORDER BY
        AVG(unitPrice) * SUM(amount) DESC
      ) AS ranking
      , allCount
    FROM
      sale
      LEFT JOIN product 
        ON(sale.productId = product.id)
      CROSS JOIN (
        SELECT
          COUNT(*) AS allCount
        FROM
          product
      )
    GROUP BY productName
    ORDER BY sumSales DESC
    LIMIT ${limit}
    OFFSET ${(currentPage - 1) * limit}
  `;
  const salesByProduct: SalesRanking[] = rawData.map((raw) => {
    const { allCount, ...sale } = raw;
    return {
      ...sale,
      sumAmount: Number(sale.sumAmount),
      ranking: Number(sale.ranking),
    };
  });

  const allPages = Math.ceil(Number(rawData[0].allCount) / limit);

  return json({ salesByProduct, allPages });
};

export default function Ranking() {
  const { salesByProduct, allPages } = useLoaderData<typeof loader>();
  return (
    <div>
      <Typography variant="h5">製品別売上ランキング</Typography>
      <Box marginTop={3}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>順位</TableCell>
                <TableCell>製品別</TableCell>
                <TableCell>単価</TableCell>
                <TableCell>売上個数</TableCell>
                <TableCell>売上合計金額</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesByProduct.map((sale, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell>{sale.ranking}</TableCell>
                    <TableCell>{sale.productName}</TableCell>
                    <TableCell>{sale.unitPrice}</TableCell>
                    <TableCell>{sale.sumAmount}</TableCell>
                    <TableCell>{sale.sumSales}</TableCell>
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
