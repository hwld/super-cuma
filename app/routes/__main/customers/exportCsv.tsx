import type { LoaderArgs } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { stringify } from "csv";
import { findCustomers } from "~/models/customer/finder.server";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" });

  const customers = await findCustomers();

  const stream = stringify(
    customers.map((c) => ({
      customerCd: c.customerCd,
      name: c.name,
      kana: c.kana,
      gender: c.gender,
      companyId: c.company.id,
      zip: c.zip,
      prefectureId: c.prefecture.id,
      address1: c.address1,
      address2: c.address2,
      phone: c.phone,
      fax: c.fax,
      email: c.email,
      lasttrade: c.lasttrade?.toUTCString(),
    })),
    { header: true }
  );

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-type": "text/csv",
      "Content-Disposition": "attachment; filename=customers.csv",
    },
  });
};
