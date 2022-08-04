import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Table } from "react-bootstrap";
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
  select productName
  , avg(unitPrice) as unitPrice
  , sum(amount) as sumAmount
  , avg(unitPrice) * sum(amount) as sumSales
  from sale
  left join product on (sale.productId = product.id)
  group by productName
  order by sumSales desc
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
      <h3>製品別売上ランキング</h3>
      <Table>
        <thead>
          <tr>
            <th>順位</th>
            <th>製品名</th>
            <th>単価</th>
            <th>売上個数</th>
            <th>売上合計金額</th>
          </tr>
        </thead>
        <tbody>
          {salesByProduct.map((sale, i) => {
            return (
              <tr key={i}>
                <td>{sale.ranking}</td>
                <td>{sale.productName}</td>
                <td>{sale.unitPrice}</td>
                <td>{sale.sumAmount}</td>
                <td>{sale.sumSales}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
