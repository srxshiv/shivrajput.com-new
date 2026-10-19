/**
 * Fire an Umami custom event. No-ops when the script isn't loaded (no env
 * configured, ad-blocked, SSR) so callers never need to guard.
 */
export function track(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const umami = (
    window as unknown as {
      umami?: { track: (e: string, d?: Record<string, unknown>) => void };
    }
  ).umami;
  try {
    umami?.track(event, data);
  } catch {
    /* analytics must never break the site */
  }
}
