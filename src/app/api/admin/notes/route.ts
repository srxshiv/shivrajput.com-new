import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** All notes, including hidden ones, for moderation. */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const notes = await db.visitorNote.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
  });
  return Response.json({ notes });
}

/** Toggle a note's visibility. */
export async function PATCH(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let payload: { id?: unknown; hidden?: unknown };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  if (typeof payload.id !== "string") {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const note = await db.visitorNote.update({
    where: { id: payload.id },
    data: { hidden: payload.hidden === true },
  });
  return Response.json({ note });
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

  await db.visitorNote.delete({ where: { id } });
  return Response.json({ ok: true });
}
