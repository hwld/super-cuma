import { Prisma } from "@prisma/client";
import { db } from "~/db.server";
import type { Company } from ".";

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
