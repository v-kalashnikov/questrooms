import { NextResponse } from "next/server";
import db from "@/modules/db";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (isNaN(Number(id))) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const body = await request.json();
  const { name, peopleCount, phone, isLegal, scheduledAt, status } = body;

  if (![name, peopleCount, phone].every(Boolean)) {
    return NextResponse.json(
      { message: "Введіть дані у всі поля" },
      { status: 400 }
    );
  }

  const updatedOrder = await db.order.update({
    where: { id: Number(id) },
    data: {
      name,
      peopleCount,
      phone,
      isLegal,
      status,
      ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
    },
  });

  return NextResponse.json(updatedOrder, { status: 200 });
}
