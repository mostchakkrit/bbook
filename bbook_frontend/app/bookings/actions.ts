"use server";

import { apiFetchAuth } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function cancelBookingAction(id: string) {
  const res = await apiFetchAuth(`/book/${id}`, { method: "DELETE" });
  if (res.status === 401) {
    redirect("/login");
  }
  revalidatePath("/bookings");
}
