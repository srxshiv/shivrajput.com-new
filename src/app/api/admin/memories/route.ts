import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const memories = await db.memory.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return Response.json({ memories });
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const caption =
    typeof payload.caption === "string"
      ? payload.caption.trim().slice(0, 180)
      : "";
  if (!caption) {
    return Response.json({ error: "Caption is required." }, { status: 400 });
  }

  const imageUrl =
    typeof payload.imageUrl === "string" && /^https?:\/\//.test(payload.imageUrl)
      ? payload.imageUrl.trim()
      : null;

  const data = {
    caption,
    imageUrl,
    rotation: Number.isFinite(Number(payload.rotation))
      ? Math.max(-12, Math.min(12, Number(payload.rotation)))
      : 0,
    order: Number.isFinite(Number(payload.order)) ? Number(payload.order) : 0,
  };

  const id = typeof payload.id === "string" && payload.id ? payload.id : null;
  const memory = id
    ? await db.memory.update({ where: { id }, data })
    : await db.memory.create({ data });
  return Response.json({ memory }, { status: id ? 200 : 201 });
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  await db.memory.delete({ where: { id } });
  return Response.json({ ok: true });
}
