import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const videos = await db.video.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        url: true,
        note: true,
        publishedAt: true,
      },
    });
    return Response.json({ videos });
  } catch {
    return Response.json({ videos: [], error: "unavailable" });
  }
}
