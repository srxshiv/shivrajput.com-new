import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const memories = await db.memory.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { id: true, imageUrl: true, caption: true, rotation: true },
    });
    return Response.json({ memories });
  } catch {
    return Response.json({ memories: [], error: "unavailable" });
  }
}
