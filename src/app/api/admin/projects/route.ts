import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const STORY_KINDS = new Set(["decision", "feature", "metric", "challenge", "quirk"]);
const LEVELS = new Set(["advanced", "intermediate", "beginner"]);

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function cleanStory(raw: unknown) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item): item is { kind: string; title: string; body: string } =>
        !!item &&
        typeof item === "object" &&
        typeof (item as { title?: unknown }).title === "string" &&
        typeof (item as { body?: unknown }).body === "string"
    )
    .map((item) => ({
      kind: STORY_KINDS.has(item.kind) ? item.kind : "feature",
      title: item.title.slice(0, 140),
      body: item.body.slice(0, 2000),
    }))
    .slice(0, 30);
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const projects = await db.project.findMany({ orderBy: { order: "asc" } });
  return Response.json({ projects });
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

  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  if (title.length < 2) {
    return Response.json({ error: "Title is too short." }, { status: 400 });
  }

  const str = (key: string) =>
    typeof payload[key] === "string" ? (payload[key] as string).trim() : "";

  const data = {
    title,
    year: str("year") || new Date().getFullYear().toString(),
    summary: str("summary"),
    detail: str("detail"),
    image: str("image") || null,
    live: str("live") || null,
    github: str("github") || null,
    stack: Array.isArray(payload.stack)
      ? (payload.stack as unknown[])
          .filter((s): s is string => typeof s === "string")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 12)
      : [],
    story: cleanStory(payload.story),
    level: LEVELS.has(str("level")) ? str("level") : "intermediate",
    order: Number.isFinite(Number(payload.order)) ? Number(payload.order) : 0,
    published: payload.published !== false,
    slug: str("slug") ? slugify(str("slug")) : slugify(title),
  };

  const id = typeof payload.id === "string" && payload.id ? payload.id : null;

  try {
    const project = id
      ? await db.project.update({ where: { id }, data })
      : await db.project.create({ data });
    return Response.json({ project }, { status: id ? 200 : 201 });
  } catch {
    return Response.json(
      { error: "That slug is already taken." },
      { status: 409 }
    );
  }
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  await db.project.delete({ where: { id } });
  return Response.json({ ok: true });
}
