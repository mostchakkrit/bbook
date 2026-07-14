import "server-only";
import { cookies } from "next/headers";

import { decodeJwt } from "@/lib/jwt";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;
  return decodeJwt(token);
}
