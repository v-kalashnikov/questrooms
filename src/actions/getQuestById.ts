"use server";

import db from "@/modules/db";

export async function getQuestById(id: string) {
  if (isNaN(Number(id))) {
    throw new Error("Invalid quest id");
  }

  const quest = await db.quest.findUnique({
    where: { id: Number(id) },
  });

  if (!quest) {
    throw new Error("Quest not found");
  }

  return quest;
}
