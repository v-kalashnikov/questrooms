"use server";

import db from "@/modules/db";

export async function getQuests() {
  try {
    return await db.quest.findMany();
  } catch (error) {
    console.error("Failed to fetch quests:", error);
    return [];
  }
}
