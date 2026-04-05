import { jwtVerify, SignJWT } from "jose";
import { z } from "zod";

const LOGIN_SCHEMA = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(128),
});

export type LoginPayload = z.infer<typeof LOGIN_SCHEMA>;

type SessionPayload = {
  sub: string;
  email: string;
  role: "admin";
};

const SESSION_COOKIE_NAME = "cc_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

function getJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_JWT_SECRET debe tener al menos 32 caracteres.");
  }
  return new TextEncoder().encode(secret);
}

export function parseLoginPayload(input: unknown): LoginPayload {
  return LOGIN_SCHEMA.parse(input);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      payload.role !== "admin"
    ) {
      return null;
    }
    return {
      sub: payload.sub,
      email: payload.email,
      role: "admin",
    };
  } catch {
    return null;
  }
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}

export function getSessionDurationSeconds(): number {
  return SESSION_DURATION_SECONDS;
}
