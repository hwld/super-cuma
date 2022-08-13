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

type Avg = {
  customerName: string;
  avgPayment: number;
};

export const loader = async (args: LoaderArgs) => {
  const rawAvgs = (await db.$queryRaw`
  SELECT
    name AS customerName
    , AVG(amount * unitPrice) as avgPayment
  FROM
    sale
    LEFT JOIN product
      ON(sale.productId = product.id)
    LEFT JOIN customer
      ON(sale.customerId = customer.id)
  GROUP BY
    name
  ORDER BY
    avgPayment DESC
  `) as Avg[];

  return json({ rawAvgs });
};

export default function AVG() {
  const { rawAvgs } = useLoaderData<typeof loader>();

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
              {rawAvgs.map((avg, i) => {
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
      </Box>
    </div>
  );
}
