import { NextResponse } from "next/server";
import db from "@/modules/db";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const body = await request.json();
  const { title, description, previewImg, coverImg, type, level, peopleCount, duration } = body;

  if (
    ![
      title,
      description,
      previewImg,
      coverImg,
      type,
      level,
      peopleCount,
      duration,
    ].every(Boolean)
  ) {
    return NextResponse.json(
      { message: "Введіть дані у всі поля" },
      { status: 400 }
    );
  }

  const updatedQuest = await db.quest.update({
    where: { id },
    data: {
      title,
      description,
      previewImg,
      coverImg,
      type,
      level,
      peopleCount,
      duration,
    },
  });

  return NextResponse.json(updatedQuest, { status: 200 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  await db.quest.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Quest deleted" }, { status: 200 });
}
