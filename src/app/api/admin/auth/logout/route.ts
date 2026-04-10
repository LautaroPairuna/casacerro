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

  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost ?? request.headers.get("host");
  const requestProtocol = new URL(request.url).protocol.replace(":", "");
  const protocol = forwardedProto ?? requestProtocol ?? "http";
  const baseUrl =
    host
      ? `${protocol}://${host}`
      : configuredSiteUrl && configuredSiteUrl.length > 0
        ? configuredSiteUrl
        : request.url;

  const loginUrl = new URL("/admin/login", baseUrl);
  return NextResponse.redirect(loginUrl, { status: 303 });
}
