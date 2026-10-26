/**
 * Visitor tracking. Every event goes to the first-party log (/api/pulse →
 * admin "Visitors" tab) and to Umami when its script is loaded. No-ops on the
 * server, when storage is blocked, or in the admin's own browser — and never
 * throws, so callers never need to guard.
 */

const ENDPOINT = "/api/pulse";
const VISITOR_KEY = "shivos-vid";
const SESSION_KEY = "shivos-sid";
const OPT_OUT_KEY = "shivos-notrack";
const SESSION_IDLE = 30 * 60_000;
const HEARTBEAT = 30_000;

let lastTrackAt = -Infinity;

const randomId = () => crypto.randomUUID().replace(/-/g, "");

/** Visitor id persists across visits; session id lives per tab, 30 min idle. */
function ids() {
  try {
    if (localStorage.getItem(OPT_OUT_KEY)) return null;
    let vid = localStorage.getItem(VISITOR_KEY);
    if (!vid) {
      vid = randomId();
      localStorage.setItem(VISITOR_KEY, vid);
    }
    const now = Date.now();
    const [stored, last] = (sessionStorage.getItem(SESSION_KEY) ?? "").split(":");
    const alive = stored && now - Number(last) < SESSION_IDLE;
    const sid = alive ? stored : randomId();
    sessionStorage.setItem(SESSION_KEY, `${sid}:${now}`);
    return { vid, sid, isNew: !alive };
  } catch {
    return null;
  }
}

/** Where the visit came from — only sent when a session starts. */
function context() {
  const params = new URLSearchParams(location.search);
  let ref: string | undefined;
  try {
    const url = new URL(document.referrer);
    if (url.host !== location.host) {
      ref = url.hostname.replace(/^www\./, "") + url.pathname.replace(/\/$/, "");
    }
  } catch {
    /* no referrer */
  }
  return {
    ref,
    source: params.get("ref") ?? params.get("utm_source") ?? undefined,
    screen: `${screen.width}x${screen.height}`,
    lang: navigator.language,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

function send(name: string, data?: Record<string, unknown>) {
  const id = ids();
  if (!id) return;
  // a tab coming back after the idle cutoff starts a fresh visit
  if (id.isNew && name === "ping") name = "pageview";
  const body = JSON.stringify({
    sid: id.sid,
    vid: id.vid,
    name,
    data,
    path: location.pathname,
    ctx: id.isNew ? context() : undefined,
  });
  try {
    // survives the tab closing, unlike a normal fetch
    if (navigator.sendBeacon?.(ENDPOINT, body)) return;
  } catch {
    /* fall through */
  }
  fetch(ENDPOINT, { method: "POST", body, keepalive: true }).catch(() => {});
}

export function track(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  lastTrackAt = performance.now();
  send(event, data);
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

/** Called from the admin panel so the owner's browser never counts itself. */
export function optOut() {
  try {
    localStorage.setItem(OPT_OUT_KEY, "1");
  } catch {
    /* storage blocked — the server-side admin check still applies */
  }
}

/** Log any link/button click that no explicit track() call already covered. */
function onClick(e: MouseEvent) {
  const el = (e.target as Element | null)?.closest?.(
    "a, button, [role=button], [data-track]"
  );
  if (!el || el.closest("[data-no-track]")) return;
  const label = (
    el.getAttribute("data-track") ||
    el.getAttribute("aria-label") ||
    el.textContent ||
    ""
  )
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
  const href = el instanceof HTMLAnchorElement ? el.href.slice(0, 200) : undefined;
  if (!label && !href) return;
  const at = performance.now();
  // this listener runs before React's; let the click's own handlers go first
  setTimeout(() => {
    if (lastTrackAt < at) send("click", href ? { label, href } : { label });
  }, 0);
}

let started = false;

/** Landing pageview, heartbeat for time-on-site, and click capture. */
export function startPulse() {
  if (started || typeof window === "undefined") return;
  started = true;
  if (location.pathname.startsWith("/admin")) return;

  send("pageview", { path: location.pathname });
  setInterval(() => {
    if (document.visibilityState === "visible") send("ping");
  }, HEARTBEAT);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") send("ping");
  });
  window.addEventListener("click", onClick, true);
}
