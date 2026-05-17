"use server";

import { createSession } from "@/lib/api/session";
import { z } from "zod";
// 1. Імпортуємо утиліту для редіректу
import { redirect } from "next/navigation";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .trim(),
});

export async function signIn(prevState: any, formData: FormData) {
  const parse = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parse.success) {
    return {
      success: false,
      message: parse.error.issues,
    };
  }

  const data = parse.data;
  let isRedirectNeeded = false; // Прапорець для успішного статусу

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/api/auth/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }

    const user = await res.json();
    await createSession(user.id, user.email);

    // Якщо дійшли сюди — авторизація успішна
    isRedirectNeeded = true; 

  } catch (e: any) {
    return { success: false, message: e.message };
  }

  // 2. Виконуємо редірект ПОЗА блоком try/catch
  if (isRedirectNeeded) {
    redirect("/uk/quests");
  }
}