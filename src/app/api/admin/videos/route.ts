import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const videos = await db.video.findMany({ orderBy: { order: "asc" } });
  return Response.json({ videos });
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

  const title =
    typeof payload.title === "string" ? payload.title.trim().slice(0, 140) : "";
  const url = typeof payload.url === "string" ? payload.url.trim() : "";
  if (!title || !/^https?:\/\//.test(url)) {
    return Response.json(
      { error: "Title and a valid URL are required." },
      { status: 400 }
    );
  }

  const data = {
    title,
    url,
    note:
      typeof payload.note === "string"
        ? payload.note.trim().slice(0, 240) || null
        : null,
    publishedAt:
      typeof payload.publishedAt === "string" && payload.publishedAt
        ? new Date(payload.publishedAt)
        : null,
    order: Number.isFinite(Number(payload.order)) ? Number(payload.order) : 0,
    published: payload.published !== false,
  };

  const id = typeof payload.id === "string" && payload.id ? payload.id : null;
  const video = id
    ? await db.video.update({ where: { id }, data })
    : await db.video.create({ data });
  return Response.json({ video }, { status: id ? 200 : 201 });
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  await db.video.delete({ where: { id } });
  return Response.json({ ok: true });
}
