import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "shivos_admin";

function adminPassword() {
  const password = process.env.ADMIN_PASSWORD;
  // fail closed: no password configured means no admin access at all
  if (!password || password.length < 8) return null;
  return password;
}

/** Deterministic session token derived from the password — no session store needed. */
function tokenFor(password: string) {
  return createHmac("sha256", password).update("shivos-admin-v1").digest("hex");
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Validate a submitted password and return the cookie token, or null. */
export function login(submitted: string) {
  const password = adminPassword();
  if (!password) return null;
  if (!safeEqual(submitted, password)) return null;
  return tokenFor(password);
}

/** Is the current request an authenticated admin? */
export async function isAdmin() {
  const password = adminPassword();
  if (!password) return false;
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return safeEqual(token, tokenFor(password));
}

/** Guard for admin route handlers. */
export async function requireAdmin() {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function adminConfigured() {
  return adminPassword() !== null;
}
