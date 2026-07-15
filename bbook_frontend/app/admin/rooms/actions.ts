"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { apiFetchAuth } from "@/lib/api";

function parseRoomForm(formData: FormData) {
  return {
    name: formData.get("name") as string,
    capacity: Number(formData.get("capacity")),
    location: formData.get("location") as string,
    amenities: formData.getAll("amenities") as string[],
  };
}

async function extractError(res: Response) {
  const body = await res.json();
  return Array.isArray(body.message)
    ? body.message.join(", ")
    : (body.message ?? "บันทึกไม่สำเร็จ");
}

export async function createRoomAction(prevState: unknown, formData: FormData) {
  const res = await apiFetchAuth("/room", {
    method: "POST",
    body: JSON.stringify(parseRoomForm(formData)),
  });
  if (!res.ok) {
    return { error: await extractError(res) };
  }
  revalidatePath("/admin/rooms");
  revalidatePath("/");
  redirect("/admin/rooms");
}

export async function updateRoomAction(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const res = await apiFetchAuth(`/room/${id}`, {
    method: "PATCH",
    body: JSON.stringify(parseRoomForm(formData)),
  });
  if (!res.ok) {
    return { error: await extractError(res) };
  }
  revalidatePath("/admin/rooms");
  revalidatePath("/");
  redirect("/admin/rooms");
}

export async function deleteRoomAction(id: string) {
  await apiFetchAuth(`/room/${id}`, { method: "DELETE" });
  revalidatePath("/admin/rooms");
  revalidatePath("/");
}
