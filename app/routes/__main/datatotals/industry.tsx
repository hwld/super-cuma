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
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { IndustryPieChart } from "~/components/IndustryPieChart";
import { db } from "~/db.server";

type RawCustomersByIndustry = {
  businessCategoryName: string;
  customerCount: BigInt;
};
export type CustomersByIndustry = {
  businessCategoryName: string;
  customerCount: number;
};

export const loader = async () => {
  const rawData = await db.$queryRaw<RawCustomersByIndustry[]>`
    SELECT
      businessCategoryName,
      COUNT(customer.id) AS customerCount
    FROM
      businessCategory
      LEFT JOIN company
        ON(company.businessCategoryId = businessCategory.id)
      LEFT JOIN customer
        ON(customer.companyId = company.id)
    GROUP BY
      businessCategoryName
    ORDER BY
      customerCount DESC
  `;

  const customersByIndustries: CustomersByIndustry[] = rawData.map((result) => {
    return {
      businessCategoryName: result.businessCategoryName,
      customerCount: Number(result.customerCount),
    };
  });

  return json({ customersByIndustries });
};

export default function Industry() {
  const { customersByIndustries } = useLoaderData<typeof loader>();

  return (
    <div>
      <Typography variant="h5">業種ごとの顧客数</Typography>
      <Box marginTop={3} width={"100%"} height={"250px"}>
        <IndustryPieChart customersByIndustries={customersByIndustries} />
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>業種</TableCell>
              <TableCell>顧客数</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customersByIndustries.map((d, i) => {
              return (
                <TableRow key={i}>
                  <TableCell>{d.businessCategoryName}</TableCell>
                  <TableCell>{d.customerCount}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
