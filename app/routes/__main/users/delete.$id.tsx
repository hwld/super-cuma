import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/db.server";
import { authenticator, requireAuthentication } from "~/services/auth.server";

export const action = async ({ request, params }: ActionArgs) => {
  if (typeof params.id !== "string") {
    throw new Error("不正なリクエストです");
  }
  const userId = Number(params.id);

  const loggedInUser = await requireAuthentication(
    request,
    (user) => user.isAdmin || user.id === userId
  );

  await db.user.delete({ where: { id: userId } });

  if (loggedInUser.id === userId) {
    return authenticator.logout(request, { redirectTo: "/login" });
  }
  return json(null);
};
