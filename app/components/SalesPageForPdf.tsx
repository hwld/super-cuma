import { Table } from "react-bootstrap";
import type { Sale } from "~/models/sale";

type Props = { sales: Sale[] };
export const SalesPageForPdf: React.VFC<Props> = ({ sales }) => {
  return (
    <html>
      <head>
        <link
          href="https://unpkg.com/bootstrap@5.2.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
      </head>
      <body style={{ maxWidth: "70%", margin: "3rem auto" }}>
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
                  <td>{sale.purchaseData.toUTCString()}</td>
                  <td>{sale.amount}</td>
                  <td>{sale.unitPrice}</td>
                  <td>{sale.revenue}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </body>
    </html>
  );
};
