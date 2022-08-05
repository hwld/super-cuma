import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/db.server";
import { requireAuthentication } from "~/services/auth.server";

export const action = async ({ request, params }: ActionArgs) => {
  await requireAuthentication(request, (user) => user.isAdmin);

  if (typeof params.id !== "string") {
    throw new Error("不正なリクエストです");
  }

  const customerId = Number(params.id);
  await db.customer.delete({ where: { id: customerId } });
  return json(null);
};
