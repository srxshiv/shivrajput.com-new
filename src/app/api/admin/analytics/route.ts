import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Thin authenticated proxy to the Umami API so the dashboard can query stats
 * without shipping the API key to the browser. 60s in-memory cache per query.
 */
const cache = new Map<string, { at: number; data: unknown; status: number }>();
const TTL = 60_000;

const RANGES: Record<string, { ms: number; unit: "hour" | "day" }> = {
  "24h": { ms: 24 * 3600_000, unit: "hour" },
  "7d": { ms: 7 * 24 * 3600_000, unit: "day" },
  "30d": { ms: 30 * 24 * 3600_000, unit: "day" },
  "90d": { ms: 90 * 24 * 3600_000, unit: "day" },
};

const METRIC_TYPES = new Set([
  "url",
  "referrer",
  "browser",
  "os",
  "device",
  "country",
  "event",
]);

export async function GET(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const apiKey = process.env.UMAMI_API_KEY;
  const base = process.env.UMAMI_API_URL || "https://api.umami.is/v1";

  if (!websiteId || !apiKey) {
    return Response.json({ configured: false });
  }

  const params = new URL(request.url).searchParams;
  const type = params.get("type") ?? "stats";
  const range = RANGES[params.get("range") ?? "7d"] ?? RANGES["7d"];
  const endAt = Date.now();
  const startAt = endAt - range.ms;

  let upstream: string;
  if (type === "stats") {
    upstream = `${base}/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`;
  } else if (type === "series") {
    upstream = `${base}/websites/${websiteId}/pageviews?startAt=${startAt}&endAt=${endAt}&unit=${range.unit}&timezone=Asia/Kolkata`;
  } else if (type === "metrics") {
    const metric = params.get("metric") ?? "url";
    if (!METRIC_TYPES.has(metric)) {
      return Response.json({ error: "Bad metric" }, { status: 400 });
    }
    upstream = `${base}/websites/${websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&type=${metric}&limit=12`;
  } else {
    return Response.json({ error: "Bad type" }, { status: 400 });
  }

  // cache key ignores the rolling endAt (bucketed to the TTL window)
  const key = `${type}:${params.get("metric") ?? ""}:${params.get("range")}:${Math.floor(endAt / TTL)}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) {
    return Response.json(hit.data as object, { status: hit.status });
  }

  try {
    const res = await fetch(upstream, {
      headers: { "x-umami-api-key": apiKey },
    });
    const data = (await res.json().catch(() => ({}))) as object;
    const body = { configured: true, data };
    cache.set(key, { at: Date.now(), data: body, status: res.status });
    if (cache.size > 100) cache.clear();
    return Response.json(body, { status: res.status });
  } catch {
    return Response.json(
      { configured: true, error: "Umami did not answer" },
      { status: 502 }
    );
  }
}
