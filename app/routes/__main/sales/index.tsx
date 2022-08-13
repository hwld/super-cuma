import {
  Box,
  Button,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { Table } from "react-bootstrap";
import { findSales } from "~/models/sale/finder.server";

export const loader = async () => {
  const sales = await findSales();
  sales.sort((a, b) => {
    return b.revenue - a.revenue;
  });
  return json({ sales });
};

export default function SalesHome() {
  const { sales } = useLoaderData<typeof loader>();

  const headers = [
    "顧客名",
    "会社名",
    "住所",
    "製品名",
    "購入日",
    "個数",
    "単価",
    "金額",
  ];
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
          <Table size="small" width="100%">
            <TableHead>
              <TableRow>
                {headers.map((header, i) => {
                  return <TableCell key={i}>{header}</TableCell>;
                })}
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
      </Box>
    </div>
  );
}
