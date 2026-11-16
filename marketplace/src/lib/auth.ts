import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { db } from "./db";

const COOKIE = "sp_session";
const MAX_AGE = 60 * 60 * 24 * 14; // 14 dias

function key() {
  const s = process.env.SESSION_SECRET;
  if (!s || (process.env.NODE_ENV === "production" && s.length < 32)) {
    throw new Error("Defina SESSION_SECRET com pelo menos 32 caracteres.");
  }
  return new TextEncoder().encode(s);
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(key());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: MAX_AGE
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function currentUser() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    if (!payload.sub) return null;
    return await db.user.findUnique({ where: { id: payload.sub }, include: { store: true } });
  } catch {
    return null;
  }
}

export async function requireUser(next = "/") {
  const u = await currentUser();
  if (!u) redirect(`/entrar?next=${encodeURIComponent(next)}`);
  return u;
}

export async function requireSeller() {
  const u = await requireUser("/painel");
  if (!u.store) redirect("/vender");
  return { user: u, store: u.store };
}

export async function requireAdmin() {
  const u = await requireUser("/admin");
  if (u.role !== "ADMIN") redirect("/");
  return u;
}
