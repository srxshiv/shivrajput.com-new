import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 70);
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const posts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json({ posts });
}

/** Create (no id) or update (with id). */
export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let payload: {
    id?: unknown;
    title?: unknown;
    body?: unknown;
    excerpt?: unknown;
    imageUrl?: unknown;
    published?: unknown;
    slug?: unknown;
  };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const body = typeof payload.body === "string" ? payload.body : "";
  const excerpt = typeof payload.excerpt === "string" ? payload.excerpt.trim() : "";
  const imageUrl = typeof payload.imageUrl === "string" ? payload.imageUrl.trim() : "";
  const published = payload.published !== false;
  const id = typeof payload.id === "string" && payload.id ? payload.id : null;

  if (title.length < 2) {
    return Response.json({ error: "Title is too short." }, { status: 400 });
  }
  if (body.trim().length < 2) {
    return Response.json({ error: "Body is empty." }, { status: 400 });
  }

  const requestedSlug =
    typeof payload.slug === "string" && payload.slug.trim()
      ? slugify(payload.slug)
      : slugify(title);
  const slug = requestedSlug || `post-${Date.now()}`;

  const data = {
    title,
    body,
    excerpt: excerpt || null,
    imageUrl: imageUrl || null,
    published,
  };

  try {
    if (id) {
      const post = await db.blogPost.update({
        where: { id },
        data: { ...data, slug },
      });
      return Response.json({ post });
    }
    const post = await db.blogPost.create({ data: { ...data, slug } });
    return Response.json({ post }, { status: 201 });
  } catch {
    return Response.json(
      { error: "That slug is already taken — tweak the title." },
      { status: 409 }
    );
  }
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

  await db.blogPost.delete({ where: { id } });
  return Response.json({ ok: true });
}
