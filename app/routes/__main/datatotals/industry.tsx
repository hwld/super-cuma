import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Table } from "react-bootstrap";
import { db } from "~/db.server";

type RawCustomersByIndustry = {
  businessCategoryName: string;
  customerCount: BigInt;
};
type CustomersByIndustry = {
  businessCategoryName: string;
  customerCount: number;
};

export const loader = async (args: LoaderArgs) => {
  const raw = (await db.$queryRaw`
  SELECT
    businessCategoryName,
    COUNT(cu.id) AS customerCount
  FROM
    businessCategory AS bc
    LEFT JOIN Company AS co 
      ON(co.businessCategoryId = bc.id)
    LEFT JOIN Customer AS cu
      ON(cu.companyId = co.id)
  GROUP BY
    businessCategoryName
  ORDER BY
    customerCount DESC
  `) as RawCustomersByIndustry[];
  const customersByIndustry: CustomersByIndustry[] = raw.map((result) => {
    return {
      businessCategoryName: result.businessCategoryName,
      customerCount: Number(result.customerCount),
    };
  });

  return json({ customersByIndustry });
};

export default function Industry() {
  const { customersByIndustry } = useLoaderData<typeof loader>();

  return (
    <div>
      <h3>業種ごとの顧客数</h3>
      <Table>
        <thead>
          <tr>
            <th>業種</th>
            <th>顧客数</th>
          </tr>
        </thead>
        <tbody>
          {customersByIndustry.map((d, i) => {
            return (
              <tr key={i}>
                <td>{d.businessCategoryName}</td>
                <td>{d.customerCount}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
