import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const KEY_RE = /^[a-z0-9_]{2,40}$/;

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const entries = await db.contextEntry.findMany({
    orderBy: [{ order: "asc" }, { key: "asc" }],
  });
  return Response.json({ entries });
}

/** Upsert by key — same endpoint creates and edits. */
export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let payload: {
    key?: unknown;
    label?: unknown;
    content?: unknown;
    order?: unknown;
  };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const key =
    typeof payload.key === "string" ? payload.key.trim().toLowerCase() : "";
  const content = typeof payload.content === "string" ? payload.content.trim() : "";
  const label = typeof payload.label === "string" ? payload.label.trim() : "";
  const order = Number.isFinite(Number(payload.order)) ? Number(payload.order) : 0;

  if (!KEY_RE.test(key)) {
    return Response.json(
      { error: "Key must be 2–40 chars, lowercase letters, numbers or _" },
      { status: 400 }
    );
  }
  if (content.length < 2) {
    return Response.json({ error: "Content is empty." }, { status: 400 });
  }

  const entry = await db.contextEntry.upsert({
    where: { key },
    create: { key, content, label: label || null, order },
    update: { content, label: label || null, order },
  });

  return Response.json({ entry });
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

  await db.contextEntry.delete({ where: { id } });
  return Response.json({ ok: true });
}
