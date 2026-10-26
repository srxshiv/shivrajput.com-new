"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Download,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  ChevronDown,
  Trash2,
  X,
} from "lucide-react";
import { Kpi, MetricTable, formatDuration } from "./AnalyticsTab";

const EASE = [0.25, 1, 0.5, 1] as const;
const RANGES = ["24h", "7d", "30d", "90d"] as const;
type Range = (typeof RANGES)[number];
const PAGE = 40;

type VisitEvent = {
  name: string;
  data: Record<string, unknown> | null;
  at: string;
};

type Visit = {
  id: string;
  visitorId: string;
  visits: number;
  startedAt: string;
  lastSeenAt: string;
  landing: string | null;
  referrer: string | null;
  source: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  org: string | null;
  browser: string | null;
  os: string | null;
  device: string | null;
  screen: string | null;
  language: string | null;
  timezone: string | null;
  events: VisitEvent[];
};

/* ─────────────────────────── reading events ─────────────────────────── */

/** Actions that signal real interest — highlighted in timelines. */
const INTENT = new Set([
  "resume_click",
  "copy_email",
  "project_live_click",
  "project_source_click",
  "github_profile_click",
  "video_click",
  "note_pinned",
  "dobby_ask",
]);

const str = (v: unknown) => (v == null ? "" : String(v));

function host(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

const isEmailClick = (e: VisitEvent) =>
  e.name === "click" && str(e.data?.href).startsWith("mailto:");

function isIntent(e: VisitEvent) {
  if (INTENT.has(e.name)) return true;
  return (
    e.name === "click" &&
    /^mailto:|linkedin\.com|github\.com|\.pdf/i.test(str(e.data?.href))
  );
}

/** `app_open {app: "work"}` → "opened work" */
function describe(e: VisitEvent, first: boolean) {
  const d = e.data ?? {};
  switch (e.name) {
    case "pageview":
      return first
        ? `arrived on ${str(d.path) || "/"}`
        : `came back / reloaded ${str(d.path) || "/"}`;
    case "app_open":
      return `opened ${str(d.app)}${d.surface === "shortcut" ? " (via ⌘K or terminal)" : ""}`;
    case "project_open":
      return `opened project · ${str(d.slug)}`;
    case "project_live_click":
      return `visited the live site of ${str(d.slug)}`;
    case "project_source_click":
      return `viewed the source of ${str(d.slug)}`;
    case "resume_click":
      return "opened your résumé";
    case "copy_email":
      return "copied your email";
    case "side_switch":
      return `switched to the ${str(d.to)} side`;
    case "vibe_toggle":
      return d.on ? "turned the vibe check on" : "turned the vibe check off";
    case "terminal":
      return `typed \`${str(d.cmd)}\` in the terminal`;
    case "dobby_ask":
      return `asked Dobby: “${str(d.q)}”`;
    case "note_pinned":
      return `pinned a note: “${str(d.text)}”`;
    case "video_click":
      return `played ${str(d.title)}`;
    case "github_profile_click":
      return `opened GitHub · ${str(d.account)}`;
    case "click": {
      const href = str(d.href);
      if (href.startsWith("mailto:")) return "clicked your email link";
      const label = str(d.label);
      return href
        ? `clicked “${label || host(href)}” → ${host(href)}`
        : `clicked “${label}”`;
    }
    default:
      return Object.keys(d).length ? `${e.name} ${JSON.stringify(d)}` : e.name;
  }
}

/* ─────────────────────────── reading visits ─────────────────────────── */

const regionNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

function countryName(code: string) {
  try {
    return regionNames?.of(code) ?? code;
  } catch {
    return code;
  }
}

const place = (v: Visit) =>
  [v.city, v.country && countryName(v.country)].filter(Boolean).join(", ") ||
  "unknown location";

const via = (v: Visit) =>
  v.source ? `?ref=${v.source}` : (v.referrer ?? "direct");

const seconds = (v: Visit) =>
  (new Date(v.lastSeenAt).getTime() - new Date(v.startedAt).getTime()) / 1000;

const actions = (v: Visit) => v.events.filter((e) => e.name !== "pageview");

function when(iso: string) {
  const date = new Date(iso);
  const time = date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
  if (date.toDateString() === new Date().toDateString()) return `today ${time}`;
  const day = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return `${day}, ${time}`;
}

function offset(from: string, to: string) {
  const s = Math.max(0, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 1000));
  return `+${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Count each key once per visit, most common first. */
function tally(visits: Visit[], keys: (v: Visit) => string[]) {
  const counts = new Map<string, number>();
  for (const v of visits) {
    for (const key of new Set(keys(v))) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return [...counts]
    .map(([x, y]) => ({ x, y }))
    .sort((a, b) => b.y - a.y);
}

/* ─────────────────────────────── a visit ─────────────────────────────── */

function Badge({ children, strong }: { children: React.ReactNode; strong?: boolean }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${
        strong ? "border-accent/40 text-accent" : "border-line text-faint"
      }`}
    >
      {children}
    </span>
  );
}

function VisitRow({
  visit,
  onVisitor,
  onDelete,
}: {
  visit: Visit;
  onVisitor: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const DeviceIcon =
    visit.device === "mobile" ? Smartphone : visit.device === "tablet" ? Tablet : Monitor;
  const done = actions(visit);
  const resume = visit.events.some((e) => e.name === "resume_click");
  const email = visit.events.some((e) => e.name === "copy_email" || isEmailClick(e));
  const dobby = visit.events.some((e) => e.name === "dobby_ask");

  return (
    <div className="rounded-xl border border-line bg-surface">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 px-4 py-3 text-left"
      >
        <DeviceIcon className="mt-0.5 h-4 w-4 shrink-0 text-faint" strokeWidth={1.5} />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-[13.5px] font-medium text-foreground">
              {place(visit)}
            </span>
            <span className="font-mono text-[11px] text-faint">
              {when(visit.startedAt)}
            </span>
          </span>
          <span className="mt-0.5 block truncate text-[12px] text-muted">
            {[visit.os, visit.browser].filter(Boolean).join(" · ") || "unknown device"}
            {" · via "}
            {via(visit)}
            {visit.org ? ` · ${visit.org}` : ""}
          </span>
          {(visit.visits > 1 || resume || email || dobby) && (
            <span className="mt-1.5 flex flex-wrap gap-1.5">
              {visit.visits > 1 && <Badge>returning · {visit.visits} visits</Badge>}
              {resume && <Badge strong>résumé</Badge>}
              {email && <Badge strong>email</Badge>}
              {dobby && <Badge>asked dobby</Badge>}
            </span>
          )}
        </span>
        <span className="shrink-0 text-right font-mono text-[11px] leading-relaxed">
          <span className="block text-foreground">{formatDuration(seconds(visit))}</span>
          <span className="block text-faint">
            {done.length} action{done.length === 1 ? "" : "s"}
          </span>
        </span>
        <ChevronDown
          className={`mt-0.5 h-4 w-4 shrink-0 text-faint transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="overflow-hidden"
          >
            <ol className="border-t border-line px-4 py-3">
              {visit.events.map((event, i) => (
                <li key={i} className="flex gap-3 py-0.75">
                  <span className="w-11 shrink-0 font-mono text-[11px] text-faint">
                    {offset(visit.startedAt, event.at)}
                  </span>
                  <span
                    className={`min-w-0 wrap-break-word text-[12.5px] ${
                      isIntent(event) ? "font-medium text-foreground" : "text-muted"
                    }`}
                  >
                    {isIntent(event) && (
                      <span className="mr-1.5 inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-accent" />
                    )}
                    {describe(event, i === 0)}
                  </span>
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line px-4 py-2 font-mono text-[10.5px] text-faint">
              <span>
                {[visit.region, visit.screen, visit.language, visit.timezone]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
              <button
                onClick={onVisitor}
                className="underline-offset-2 hover:text-foreground hover:underline"
              >
                visitor {visit.visitorId.slice(0, 6)}
              </button>
              <button
                onClick={onDelete}
                className="ml-auto flex items-center gap-1 transition-colors hover:text-red-500"
              >
                <Trash2 className="h-3 w-3" />
                delete visit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────── the tab ─────────────────────────────── */

export function VisitorsTab() {
  const [range, setRange] = useState<Range>("7d");
  const [visits, setVisits] = useState<Visit[] | null>(null);
  const [capped, setCapped] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [live, setLive] = useState<number | null>(null);
  const [intentOnly, setIntentOnly] = useState(false);
  const [visitor, setVisitor] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE);

  const load = useCallback(async (r: Range) => {
    setLoading(true);
    try {
      const [res, lv] = await Promise.all([
        fetch(`/api/admin/visitors?range=${r}`),
        fetch("/api/live").then((x) => x.json()).catch(() => ({})),
      ]);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not load visits.");
        return;
      }
      setError(null);
      setVisits(data.sessions ?? []);
      setCapped(!!data.capped);
      setLive(typeof lv.active === "number" ? lv.active : null);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(range);
  }, [range, load]);

  const report = useMemo(() => {
    const all = visits ?? [];
    const has = (v: Visit, test: (e: VisitEvent) => boolean) => v.events.some(test);
    return {
      visitors: new Set(all.map((v) => v.visitorId)).size,
      visits: all.length,
      avg: all.length ? all.reduce((sum, v) => sum + seconds(v), 0) / all.length : 0,
      resume: all.filter((v) => has(v, (e) => e.name === "resume_click")).length,
      email: all.filter((v) => has(v, (e) => e.name === "copy_email" || isEmailClick(e))).length,
      apps: tally(all, (v) =>
        v.events.filter((e) => e.name === "app_open").map((e) => str(e.data?.app))
      ),
      sources: tally(all, (v) => [via(v)]),
      places: tally(all, (v) => [place(v)]),
      devices: tally(all, (v) => [[v.device, v.os].filter(Boolean).join(" · ") || "unknown"]),
      questions: tally(all, (v) =>
        v.events.filter((e) => e.name === "dobby_ask").map((e) => str(e.data?.q))
      ),
    };
  }, [visits]);

  const list = useMemo(
    () =>
      (visits ?? []).filter(
        (v) =>
          (!visitor || v.visitorId === visitor) &&
          (!intentOnly || v.events.some(isIntent))
      ),
    [visits, visitor, intentOnly]
  );

  const remove = async (id: string) => {
    await fetch(`/api/admin/visitors?id=${id}`, { method: "DELETE" });
    setVisits((prev) => prev?.filter((v) => v.id !== id) ?? null);
  };

  if (error) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6">
        <h3 className="text-[15px] font-medium text-foreground">
          Visitor log isn&apos;t readable yet
        </h3>
        <p className="mt-2 text-[13px] font-light leading-relaxed text-muted">
          {error} The tables are created with{" "}
          <code className="font-mono">npm run db:push</code>; after that every
          visit shows up here within seconds.
        </p>
      </div>
    );
  }

  if (visits === null) {
    return <Loader2 className="mx-auto mt-10 h-4 w-4 animate-spin text-muted" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => {
                setRange(r);
                setShown(PAGE);
              }}
              className={`rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${
                range === r
                  ? "bg-foreground text-background"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {typeof live === "number" && (
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {live} online now
            </span>
          )}
          <button
            onClick={() => load(range)}
            aria-label="Refresh"
            className="rounded-full border border-line p-1.5 text-faint transition-colors hover:text-foreground"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
          </button>
          <a
            href={`/api/admin/visitors?range=${range}&format=csv`}
            className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12px] text-muted transition-colors hover:text-foreground"
          >
            <Download className="h-3.5 w-3.5" />
            CSV report
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label="Visitors" value={report.visitors.toLocaleString()} />
        <Kpi label="Visits" value={report.visits.toLocaleString()} />
        <Kpi label="Avg time on site" value={formatDuration(report.avg)} />
        <Kpi
          label="Opened résumé"
          value={report.resume.toLocaleString()}
          hint={`${report.email} reached for your email`}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <MetricTable title="Apps they opened" rows={report.apps} />
        <MetricTable title="Came from" rows={report.sources} />
        <MetricTable title="Where they are" rows={report.places} />
        <MetricTable title="Devices" rows={report.devices} />
      </div>
      {report.questions.length > 0 && (
        <MetricTable title="What they asked Dobby" rows={report.questions} />
      )}

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <p className="mr-auto font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
          Every visit · newest first
        </p>
        {visitor && (
          <button
            onClick={() => setVisitor(null)}
            className="flex items-center gap-1 rounded-full border border-line px-2.5 py-1 font-mono text-[10.5px] text-muted hover:text-foreground"
          >
            visitor {visitor.slice(0, 6)}
            <X className="h-3 w-3" />
          </button>
        )}
        <button
          onClick={() => setIntentOnly((v) => !v)}
          className={`rounded-full border px-2.5 py-1 font-mono text-[10.5px] transition-colors ${
            intentOnly
              ? "border-foreground bg-foreground text-background"
              : "border-line text-muted hover:text-foreground"
          }`}
        >
          only visits that did something
        </button>
      </div>

      {list.length === 0 ? (
        <p className="py-6 text-center text-[13px] text-muted">
          No visits here yet. Your own browser is never counted — try a private
          window or your phone.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {list.slice(0, shown).map((visit) => (
            <VisitRow
              key={visit.id}
              visit={visit}
              onVisitor={() => setVisitor(visit.visitorId)}
              onDelete={() => remove(visit.id)}
            />
          ))}
          {list.length > shown && (
            <button
              onClick={() => setShown((n) => n + PAGE)}
              className="mx-auto mt-1 rounded-full border border-line px-4 py-1.5 text-[12px] text-muted transition-colors hover:text-foreground"
            >
              Show {Math.min(PAGE, list.length - shown)} more
            </button>
          )}
        </div>
      )}

      {capped && (
        <p className="text-center font-mono text-[10.5px] text-faint">
          showing the latest 500 visits in this range (the CSV too)
        </p>
      )}
    </div>
  );
}
