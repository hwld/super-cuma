import { Prisma } from "@prisma/client";
import { db } from "~/db.server";

export type Sale = {
  customerName: string;
  companyName: string;
  address?: string;
  productName: string;
  purchaseData: Date;
  amount: number;
  unitPrice: number;
  revenue: number;
};

export const saleArgs = Prisma.validator<Prisma.SaleArgs>()({
  select: {
    customer: {
      select: {
        name: true,
        address1: true,
        company: { select: { companyName: true } },
      },
    },
    product: {
      select: {
        productName: true,
        unitPrice: true,
      },
    },
    purchaseDate: true,
    amount: true,
  },
});

const convertToSale = (
  rawSale: Prisma.SaleGetPayload<typeof saleArgs>
): Sale => {
  return {
    customerName: rawSale.customer.name,
    companyName: rawSale.customer.company.companyName,
    address: rawSale.customer.address1 ?? undefined,
    productName: rawSale.product.productName,
    purchaseData: rawSale.purchaseDate,
    amount: rawSale.amount,
    unitPrice: rawSale.product.unitPrice,
    revenue: rawSale.amount * rawSale.product.unitPrice,
  };
};

type FindSalesArgs = Omit<Prisma.SaleFindManyArgs, "select" | "include">;
export const findSales = async (args?: FindSalesArgs): Promise<Sale[]> => {
  const rawSales = await db.sale.findMany({ ...saleArgs, ...args });
  return rawSales.map((rawSale) => convertToSale(rawSale));
};
