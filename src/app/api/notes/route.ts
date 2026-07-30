import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const MAX_BODY = 280;
const MAX_AUTHOR = 28;
const COLORS = ["butter", "mint", "sky", "blush", "lilac"] as const;

export async function GET() {
  try {
    const notes = await db.visitorNote.findMany({
      where: { hidden: false },
      orderBy: { createdAt: "desc" },
      take: 120,
      select: {
        id: true,
        author: true,
        body: true,
        color: true,
        createdAt: true,
      },
    });
    return Response.json({ notes });
  } catch {
    return Response.json({ notes: [], error: "unavailable" }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      body?: unknown;
      author?: unknown;
      color?: unknown;
    };

    const body = typeof payload.body === "string" ? payload.body.trim() : "";
    const author =
      typeof payload.author === "string" ? payload.author.trim() : "";
    const color =
      typeof payload.color === "string" &&
      (COLORS as readonly string[]).includes(payload.color)
        ? payload.color
        : "butter";

    if (body.length < 2) {
      return Response.json({ error: "Write a little more." }, { status: 400 });
    }
    if (body.length > MAX_BODY) {
      return Response.json(
        { error: `Keep it under ${MAX_BODY} characters.` },
        { status: 400 }
      );
    }

    // cheap spam guard: same text posted very recently
    const duplicate = await db.visitorNote.findFirst({
      where: { body, createdAt: { gt: new Date(Date.now() - 10 * 60_000) } },
      select: { id: true },
    });
    if (duplicate) {
      return Response.json(
        { error: "That note is already on the wall." },
        { status: 409 }
      );
    }

    const note = await db.visitorNote.create({
      data: {
        body,
        author: author.slice(0, MAX_AUTHOR) || null,
        color,
      },
      select: {
        id: true,
        author: true,
        body: true,
        color: true,
        createdAt: true,
      },
    });

    return Response.json({ note }, { status: 201 });
  } catch {
    return Response.json({ error: "Could not save that note." }, { status: 500 });
  }
}
