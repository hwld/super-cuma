import {
  Box,
  Paper,
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
import { db } from "~/db.server";

type RawSalesRanking = {
  productName: string;
  unitPrice: number;
  sumAmount: BigInt;
  sumSales: number;
};
type SalesRanking = Omit<RawSalesRanking, "sumAmount"> & {
  sumAmount: number;
  ranking: number;
};

export const loader = async (args: LoaderArgs) => {
  const raw = (await db.$queryRaw`
  SELECT
    productName
    , AVG(unitPrice) AS unitPrice
    , SUM(amount) AS sumAmount
    , AVG(unitPrice) * SUM(amount) AS sumSales
  FROM
    sale
    LEFT JOIN product 
      ON(sale.productId = product.id)
  GROUP BY productName
  ORDER BY sumSales DESC
  `) as RawSalesRanking[];
  const salesByProduct = raw.map((sales, i): SalesRanking => {
    return { ...sales, sumAmount: Number(sales.sumAmount), ranking: i + 1 };
  });

  return json({ salesByProduct });
};

export default function Ranking() {
  const { salesByProduct } = useLoaderData<typeof loader>();
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
      </Box>
    </div>
  );
}
