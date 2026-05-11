"use server";

import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "Title cannot be blank"),
  description: z.string().min(1, "Description cannot be blank"),
  previewImg: z.string().min(1, "Preview image is required"),
  coverImg: z.string().min(1, "Cover image is required"),
  type: z.string().min(1, "Type is required"),
  level: z.string().min(1, "Level is required"),
  peopleCount: z.array(z.number()).min(1, "At least one people count is required"),
  duration: z.number().positive("Duration must be positive"),
});

export async function createQuest(prevState: any, formData: FormData) {
  const parse = schema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    previewImg: formData.get("previewImg"),
    coverImg: formData.get("coverImg"),
    type: formData.get("type"),
    level: formData.get("level"),
    peopleCount: (formData.get("peopleCount") as string).split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)),
    duration: Number(formData.get("duration")),
  });

  if (!parse.success) {
    return {
      success: false,
      message: parse.error.issues,
    };
  }

  const data = parse.data;

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/api/create-quest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }

    return {
      success: true,
      message: `Quest "${data.title}" created successfully`,
    };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}