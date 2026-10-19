export const dynamic = "force-dynamic";

/**
 * Active-visitor count, proxied so the Umami API key never reaches the
 * client. Cached 30s in memory — the whole site polls through this one
 * function, so Umami sees at most two requests a minute.
 */
let cache: { at: number; active: number | null } = { at: 0, active: null };
const TTL = 30_000;

export async function GET() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const apiKey = process.env.UMAMI_API_KEY;
  const base = process.env.UMAMI_API_URL || "https://api.umami.is/v1";

  if (!websiteId || !apiKey) return Response.json({ active: null });

  if (Date.now() - cache.at < TTL) {
    return Response.json({ active: cache.active });
  }

  try {
    const res = await fetch(`${base}/websites/${websiteId}/active`, {
      headers: { "x-umami-api-key": apiKey },
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as unknown;
    // shapes vary between umami versions: [{x:n}] | {x:n} | {visitors:n}
    const active =
      typeof data === "number"
        ? data
        : Array.isArray(data)
          ? Number((data[0] as { x?: number })?.x ?? 0)
          : Number(
              (data as { x?: number; visitors?: number })?.x ??
                (data as { visitors?: number })?.visitors ??
                0
            );
    cache = { at: Date.now(), active: Number.isFinite(active) ? active : null };
  } catch {
    cache = { at: Date.now(), active: null };
  }

  return Response.json({ active: cache.active });
}
