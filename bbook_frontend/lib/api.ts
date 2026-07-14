import { cookies } from "next/headers";

export const apiFetchAuth = async (path: string, options?: RequestInit) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return apiFetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
};

export const apiFetch = async (path: string, options?: RequestInit) => {
  const res = await fetch(`${process.env.API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  return res;
};
