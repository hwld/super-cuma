import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Table } from "react-bootstrap";
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
      <h3>平均客単価</h3>
      <Table>
        <thead>
          <tr>
            <th>顧客名</th>
            <th>平均客単価</th>
          </tr>
        </thead>
        <tbody>
          {rawAvgs.map((avg, i) => {
            return (
              <tr key={i}>
                <td>{avg.customerName}</td>
                <td>{avg.avgPayment}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
