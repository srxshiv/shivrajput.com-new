import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const RANGES: Record<string, number> = {
  "24h": 24 * 3600_000,
  "7d": 7 * 86_400_000,
  "30d": 30 * 86_400_000,
  "90d": 90 * 86_400_000,
};
const MAX_SESSIONS = 500;

async function load(range: string) {
  const since = new Date(Date.now() - (RANGES[range] ?? RANGES["7d"]));
  const sessions = await db.visitSession.findMany({
    where: { startedAt: { gte: since } },
    orderBy: { startedAt: "desc" },
    take: MAX_SESSIONS,
    include: {
      events: {
        orderBy: { at: "asc" },
        select: { name: true, data: true, at: true },
      },
    },
  });

  // all-time visit count per visitor → "returning" badge
  const counts = await db.visitSession.groupBy({
    by: ["visitorId"],
    where: { visitorId: { in: [...new Set(sessions.map((s) => s.visitorId))] } },
    _count: { _all: true },
  });
  const visits = new Map(counts.map((c) => [c.visitorId, c._count._all]));

  return sessions.map((s) => ({ ...s, visits: visits.get(s.visitorId) ?? 1 }));
}

type Session = Awaited<ReturnType<typeof load>>[number];

const ist = (date: Date) =>
  date.toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" });

function cell(value: unknown) {
  let text = value == null ? "" : String(value);
  // visitor-typed text must not run as a spreadsheet formula
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

/** One row per event, with the visit's details repeated — pivots cleanly. */
function toCsv(sessions: Session[]) {
  const head = [
    "time_ist", "event", "details", "visit_id", "visitor_id", "visit_count",
    "visit_started_ist", "time_on_site_s", "city", "region", "country", "network",
    "device", "os", "browser", "referrer", "source", "landing",
  ];
  const rows = sessions.flatMap((s) =>
    s.events.map((e) =>
      [
        ist(e.at), e.name, e.data ? JSON.stringify(e.data) : "", s.id, s.visitorId,
        s.visits, ist(s.startedAt),
        Math.round((s.lastSeenAt.getTime() - s.startedAt.getTime()) / 1000),
        s.city, s.region, s.country, s.org, s.device, s.os, s.browser,
        s.referrer, s.source, s.landing,
      ]
        .map(cell)
        .join(",")
    )
  );
  // BOM so Excel reads UTF-8 ("Bengalūru", Dobby questions) correctly
  return "﻿" + [head.join(","), ...rows].join("\n");
}

export async function GET(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const params = new URL(request.url).searchParams;
  const range = params.get("range") ?? "7d";

  try {
    const sessions = await load(range);
    if (params.get("format") === "csv") {
      const stamp = new Date().toISOString().slice(0, 10);
      return new Response(toCsv(sessions), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="shivos-visitors-${range}-${stamp}.csv"`,
        },
      });
    }
    return Response.json({ sessions, capped: sessions.length === MAX_SESSIONS });
  } catch {
    return Response.json(
      { error: "Could not read visits — has `npm run db:push` been run?" },
      { status: 500 }
    );
  }
}

/** Remove one visit (e.g. your own test runs). Events cascade. */
export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  await db.visitSession.deleteMany({ where: { id } });
  return Response.json({ ok: true });
}
