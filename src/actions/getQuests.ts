"use server";

import db from "@/modules/db";

export async function getQuests() {
  return db.quest.findMany();
}
