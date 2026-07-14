"use server";

import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api";

export async function registerAction(prevState: any, formData: FormData) {
  const res = await apiFetch("/user", {
    method: "POST",
    body: JSON.stringify({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
    }),
  });

  if (!res.ok) {
    const body = await res.json();
    const message = Array.isArray(body.message)
      ? body.message.join(", ")
      : (body.message ?? "สมัครสมาชิกไม่สำเร็จ");
    return { error: message };
  }

  redirect("/login?registered=true");
}