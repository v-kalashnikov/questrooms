import { NextResponse } from "next/server";
import db from "@/modules/db";

export async function GET() {
  const orders = await db.order.findMany({
    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(orders, { status: 200 });
}
