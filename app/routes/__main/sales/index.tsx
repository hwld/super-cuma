import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Table } from "react-bootstrap";
import { findSales } from "~/models/sale";

export const loader = async (args: LoaderArgs) => {
  const sales = await findSales();
  sales.sort((a, b) => {
    return b.revenue - a.revenue;
  });
  return json({ sales });
};

export default function SalesHome() {
  const { sales } = useLoaderData<typeof loader>();
  return (
    <>
      <h3>売上</h3>
      <Table>
        <thead>
          <tr>
            <th>顧客名</th>
            <th>会社名</th>
            <th>住所</th>
            <th>製品名</th>
            <th>購入日</th>
            <th>個数</th>
            <th>単価</th>
            <th>金額</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale, i) => {
            return (
              <tr key={i}>
                <td>{sale.customerName}</td>
                <td>{sale.companyName}</td>
                <td>{sale.address}</td>
                <td>{sale.productName}</td>
                <td>{sale.purchaseData}</td>
                <td>{sale.amount}</td>
                <td>{sale.unitPrice}</td>
                <td>{sale.revenue}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
