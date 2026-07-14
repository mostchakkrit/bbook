"use server";

import { apiFetchAuth } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBookingAction(prevState: any, formData: FormData) {
  const startLocal = formData.get("startTime") as string;
  const endLocal = formData.get("endTime") as string;

  const res = await apiFetchAuth("/book", {
    method: "POST",
    body: JSON.stringify({
      roomId: formData.get("roomId"),
      startTime: new Date(startLocal).toISOString(),
      endTime: new Date(endLocal).toISOString(),
    }),
  });

  if (!res.ok) {
    if (res.status === 401) {
      redirect("/login");
    }
    const body = await res.json();
    const message = Array.isArray(body.message)
      ? body.message.join(", ")
      : (body.message ?? "จองไม่สำเร็จ");
    return { error: message };
  }

  revalidatePath("/");
  return { success: true };
}