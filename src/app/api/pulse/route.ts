import { after, userAgent, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * First-party visit log — the browser posts every visitor action here (see
 * lib/track.ts) and the admin "Visitors" tab reads it back. The path is
 * deliberately bland: blocklists drop anything named track/analytics/collect.
 *
 * "ping" is a heartbeat: it only bumps lastSeenAt (time on site + the live
 * count) and never writes an event row.
 */

const ID = /^[a-z0-9]{16,40}$/i;
const NAME = /^[a-z0-9_]{1,40}$/;
const MAX_DATA = 1000;
const BOT = /bot|crawl|spider|headless|lighthouse|pagespeed|preview|screenshot/i;

// per-instance flood guard: one session gets at most 120 hits a minute
const hits = new Map<string, { at: number; n: number }>();
function flooded(sid: string) {
  const now = Date.now();
  const hit = hits.get(sid);
  if (!hit || now - hit.at > 60_000) {
    if (hits.size > 5000) hits.clear();
    hits.set(sid, { at: now, n: 1 });
    return false;
  }
  hit.n += 1;
  return hit.n > 120;
}

const clip = (value: unknown, max: number) =>
  typeof value === "string" && value.trim()
    ? value.trim().slice(0, max)
    : null;

function header(request: NextRequest, name: string) {
  const value = request.headers.get(name);
  if (!value) return null;
  try {
    return decodeURIComponent(value); // vercel url-encodes city names
  } catch {
    return value;
  }
}

const noContent = () => new Response(null, { status: 204 });

export async function POST(request: NextRequest) {
  const ua = userAgent(request);
  if (ua.isBot || BOT.test(ua.ua)) return noContent();
  // never count the site owner
  if (await isAdmin()) return noContent();

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Bad body" }, { status: 400 });
  }

  const sid = String(body.sid ?? "");
  const vid = String(body.vid ?? "");
  const name = String(body.name ?? "");
  if (!ID.test(sid) || !ID.test(vid) || !NAME.test(name)) {
    return Response.json({ error: "Bad event" }, { status: 400 });
  }
  if (flooded(sid)) return Response.json({ error: "Slow down" }, { status: 429 });

  const now = new Date();

  try {
    if (name === "ping") {
      await db.visitSession.updateMany({
        where: { id: sid },
        data: { lastSeenAt: now },
      });
      return noContent();
    }

    const ctx = (body.ctx ?? {}) as Record<string, unknown>;
    const device = ua.device.type;
    const session = await db.visitSession.upsert({
      where: { id: sid },
      update: { lastSeenAt: now },
      create: {
        id: sid,
        visitorId: vid,
        startedAt: now,
        lastSeenAt: now,
        landing: clip(body.path, 200),
        referrer: clip(ctx.ref, 300),
        source: clip(ctx.source, 80),
        screen: clip(ctx.screen, 20),
        language: clip(ctx.lang, 20),
        timezone: clip(ctx.tz, 60),
        country: header(request, "x-vercel-ip-country"),
        region: header(request, "x-vercel-ip-country-region"),
        city: header(request, "x-vercel-ip-city"),
        browser: ua.browser.name ?? null,
        os: ua.os.name ?? null,
        device: device === "mobile" || device === "tablet" ? device : "desktop",
      },
      select: { startedAt: true },
    });

    let data: object | undefined;
    if (body.data && typeof body.data === "object") {
      if (JSON.stringify(body.data).length <= MAX_DATA) data = body.data;
    }
    await db.visitEvent.create({
      data: { sessionId: sid, name, data, at: now },
    });

    // brand-new session: look up who owns the network ("Google LLC",
    // "Reliance Jio"…). Only the name is kept, never the IP. Runs after the
    // response so the visitor never waits on it.
    const created = session.startedAt.getTime() === now.getTime();
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const token = process.env.IPINFO_TOKEN;
    if (created && ip && token) {
      after(async () => {
        try {
          const res = await fetch(
            `https://api.ipinfo.io/lite/${encodeURIComponent(ip)}?token=${token}`,
            { signal: AbortSignal.timeout(3000) }
          );
          const info = (await res.json()) as { as_name?: string };
          if (info.as_name) {
            await db.visitSession.update({
              where: { id: sid },
              data: { org: info.as_name.slice(0, 120) },
            });
          }
        } catch {
          /* the visit is logged either way */
        }
      });
    }
  } catch {
    // analytics must never surface as an error to a visitor
  }

  return noContent();
}
