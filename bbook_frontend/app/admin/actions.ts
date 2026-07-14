"use server";

import { revalidatePath } from "next/cache";

import { apiFetchAuth } from "@/lib/api";

export async function updateBookingStatusAction(
  id: string,
  status: "APPROVED" | "REJECTED"
) {
  await apiFetchAuth(`/book/status/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  revalidatePath("/admin");
  revalidatePath("/bookings");
}
