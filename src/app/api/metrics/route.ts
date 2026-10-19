import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const metrics = await db.metric.findMany({
      orderBy: [{ kind: "asc" }, { order: "asc" }],
      select: { id: true, kind: true, value: true, label: true, note: true },
    });
    return Response.json({ metrics });
  } catch {
    return Response.json({ metrics: [], error: "unavailable" });
  }
}
