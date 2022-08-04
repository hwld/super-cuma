import bcrypt from "bcrypt";
import { db } from "~/db.server";

export type User = {
  id: number;
  username: string;
};

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

  return { id: user.id, username: user.username };
};
