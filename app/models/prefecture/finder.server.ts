import { Prisma } from "@prisma/client";
import { db } from "~/db.server";
import type { Prefecture } from ".";

export const prefectureArgs = Prisma.validator<Prisma.PrefectureArgs>()({
  select: { id: true, prefName: true, created: true, modified: true },
});

type FindPrefecturesArgs = Omit<
  Prisma.PrefectureFindManyArgs,
  "select" | "include"
>;
export const findPrefectures = async (
  args?: FindPrefecturesArgs
): Promise<Prefecture[]> => {
  return await db.prefecture.findMany({ ...prefectureArgs, ...args });
};
