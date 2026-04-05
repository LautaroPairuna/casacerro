import { cookies } from "next/headers";
import { getSessionCookieName, verifySessionToken } from "@/lib/admin-auth";

export async function getCurrentAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
