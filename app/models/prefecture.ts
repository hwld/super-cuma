import { Prisma } from "@prisma/client";
import { db } from "~/db.server";

export type Prefecture = {
  id: number;
  prefName: string;
  created: Date;
  modified: Date;
};

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
