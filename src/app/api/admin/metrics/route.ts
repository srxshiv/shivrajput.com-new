import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const metrics = await db.metric.findMany({
    orderBy: [{ kind: "asc" }, { order: "asc" }],
  });
  return Response.json({ metrics });
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

  const value =
    typeof payload.value === "string" ? payload.value.trim().slice(0, 40) : "";
  if (!value) {
    return Response.json({ error: "Value is required." }, { status: 400 });
  }

  const data = {
    kind: payload.kind === "tech" ? "tech" : "number",
    value,
    label:
      typeof payload.label === "string"
        ? payload.label.trim().slice(0, 80) || null
        : null,
    note:
      typeof payload.note === "string"
        ? payload.note.trim().slice(0, 240) || null
        : null,
    order: Number.isFinite(Number(payload.order)) ? Number(payload.order) : 0,
  };

  const id = typeof payload.id === "string" && payload.id ? payload.id : null;
  const metric = id
    ? await db.metric.update({ where: { id }, data })
    : await db.metric.create({ data });
  return Response.json({ metric }, { status: id ? 200 : 201 });
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  await db.metric.delete({ where: { id } });
  return Response.json({ ok: true });
}
