"use server";

import { apiFetchAuth } from "@/lib/api";

export async function linkLineAction(idToken: string) {
  const res = await apiFetchAuth("/user/link-line", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    const body = await res.json();
    const message = Array.isArray(body.message)
      ? body.message.join(", ")
      : (body.message ?? "ผูกบัญชีไม่สำเร็จ");
    return { error: message };
  }
  return { success: true };
}
