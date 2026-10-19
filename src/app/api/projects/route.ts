import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await db.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        year: true,
        summary: true,
        detail: true,
        image: true,
        live: true,
        github: true,
        stack: true,
        story: true,
        level: true,
      },
    });
    return Response.json({ projects });
  } catch {
    return Response.json({ projects: [], error: "unavailable" });
  }
}
