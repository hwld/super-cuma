import type { LoaderArgs } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { chromium } from "playwright";
import { renderToString } from "react-dom/server";
import { SalesPageForPdf } from "~/components/SalesPageForPdf";
import { findSales } from "~/models/sale/finder.server";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" });

  const sales = await findSales();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const html = renderToString(<SalesPageForPdf sales={sales} />);
  await page.setContent(html, { waitUntil: "load" });
  const pdf = await page.pdf({ format: "Ledger" });
  await browser.close();

  return new Response(pdf, {
    status: 200,
    headers: { "Content-Type": "application/pdf" },
  });
};
