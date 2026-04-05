import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSessionCookieName } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl, { status: 303 });
}
