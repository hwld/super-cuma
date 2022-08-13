import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import type { Sale } from "~/models/sale";

type Props = { sales: Sale[] };
export const SalesPageForPdf: React.VFC<Props> = ({ sales }) => {
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
    <html>
      <head></head>
      <body style={{ maxWidth: "70%", margin: "3rem auto" }}>
        <Typography variant="h5">売上一覧</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {headers.map((head, i) => {
                  return <TableCell key={i}>{head}</TableCell>;
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
      </body>
    </html>
  );
};
