import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { db } from "~/db.server";
import type { UserForm } from "~/forms/userForm";
import type { User } from ".";

const userArgs = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    username: true,
    isAdmin: true,
  },
});

type LoginArgs = { username: string; password: string };
export const login = async ({
  username,
  password,
}: LoginArgs): Promise<User | undefined> => {
  const user = await db.user.findFirst({ where: { username } });
  if (!user) {
    return undefined;
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    return undefined;
  }

  return { id: user.id, username: user.username, isAdmin: user.isAdmin };
};

type Result = { type: "error"; message: string } | { type: "success" };
export const createUser = async ({
  username,
  password,
  isAdmin,
}: UserForm): Promise<Result> => {
  const sameUsernameUser = await db.user.findFirst({ where: { username } });
  if (sameUsernameUser) {
    return { type: "error", message: "すでに存在するユーザー名です" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.create({
    data: {
      username,
      password: hashedPassword,
      isAdmin,
    },
  });
  return { type: "success" };
};

export const editUser = async (
  id: number,
  { username, password, isAdmin }: UserForm
): Promise<Result> => {
  const user = await db.user.findUnique({ where: { id } });
  if (user === null) {
    return { type: "error", message: "ユーザーが存在しません" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.update({
    data: {
      username,
      password: hashedPassword,
      isAdmin,
    },
    where: { id },
  });
  return { type: "success" };
};

type FindUsersArgs = Omit<Prisma.UserFindManyArgs, "select" | "include">;
export const findUsers = async (args?: FindUsersArgs) => {
  const rawUsers = await db.user.findMany({ ...userArgs, ...args });
  const users = rawUsers.map(
    (raw): User => ({
      id: raw.id,
      username: raw.username,
      isAdmin: raw.isAdmin,
    })
  );

  return users;
};

type FindUserArgs = Omit<Prisma.UserFindFirstArgs, "select" | "include">;
export const findUser = async (args?: FindUserArgs) => {
  const rawUser = await db.user.findFirst({ ...userArgs, ...args });

  return rawUser ?? undefined;
};
