import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/db.server";

export const action = async ({ params }: ActionArgs) => {
  if (typeof params.id !== "string") {
    throw new Error("不正なリクエストです");
  }

  const customerId = Number(params.id);
  await db.customer.delete({ where: { id: customerId } });
  return json(null);
};
