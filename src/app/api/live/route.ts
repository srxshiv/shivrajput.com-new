import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Active-visitor count from the first-party visit log: visits that sent a
 * heartbeat in the last 90s. Cached 30s in memory — the whole site polls
 * through this one function.
 */
let cache: { at: number; active: number | null } = { at: 0, active: null };
const TTL = 30_000;

export async function GET() {
  if (Date.now() - cache.at < TTL) {
    return Response.json({ active: cache.active });
  }

  try {
    const active = await db.visitSession.count({
      where: { lastSeenAt: { gt: new Date(Date.now() - 90_000) } },
    });
    cache = { at: Date.now(), active };
  } catch {
    cache = { at: Date.now(), active: null };
  }

  return Response.json({ active: cache.active });
}
