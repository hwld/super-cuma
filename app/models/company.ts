import { Prisma } from "@prisma/client";
import { db } from "~/db.server";

export type Company = {
  id: number;
  companyName: string;
  companyKana: string;
};

export const companyArgs = Prisma.validator<Prisma.CompanyArgs>()({
  select: {
    id: true,
    companyName: true,
    companyKana: true,
    created: true,
    modified: true,
  },
});

type FindCompaniesArgs = Omit<Prisma.CompanyFindManyArgs, "select" | "include">;
export const findCompanies = async (
  args?: FindCompaniesArgs
): Promise<Company[]> => {
  return await db.company.findMany({ ...companyArgs, ...args });
};
