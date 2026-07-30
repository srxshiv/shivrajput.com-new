import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminConfigured, isAdmin, login } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    authed: await isAdmin(),
    configured: adminConfigured(),
  });
}

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return Response.json(
      { error: "ADMIN_PASSWORD is not set on the server." },
      { status: 503 }
    );
  }

  let password = "";
  try {
    const payload = (await request.json()) as { password?: unknown };
    password = typeof payload.password === "string" ? payload.password : "";
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const token = login(password);
  if (!token) {
    // small delay muddies brute-force timing a little
    await new Promise((r) => setTimeout(r, 400));
    return Response.json({ error: "Wrong password." }, { status: 401 });
  }

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return Response.json({ authed: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  return Response.json({ authed: false });
}
