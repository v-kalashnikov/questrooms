"use server";

import db from "@/modules/db";

export async function getOrders() {
  try {
    return await db.order.findMany({
      orderBy: {
        id: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}
