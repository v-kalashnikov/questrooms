"use server";

import db from "@/modules/db";

export async function getOrders() {
  return db.order.findMany({
    orderBy: {
      id: "desc",
    },
  });
}
