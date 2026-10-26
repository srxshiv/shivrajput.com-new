"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ExternalLink } from "lucide-react";

const RANGES = ["24h", "7d", "30d", "90d"] as const;
type Range = (typeof RANGES)[number];

type Stats = Record<string, number | { value: number; prev?: number }>;
type Point = { x: string; y: number };
type MetricRow = { x: string | null; y: number };

const num = (v: number | { value: number } | undefined) =>
  typeof v === "number" ? v : (v?.value ?? 0);

export function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
        {label}
      </p>
      <p className="mt-1.5 font-mono text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {hint && <p className="mt-0.5 text-[11px] text-faint">{hint}</p>}
    </div>
  );
}

function Bars({ points }: { points: Point[] }) {
  const max = Math.max(...points.map((p) => p.y), 1);
  return (
    <div className="flex h-28 items-end gap-[3px]">
      {points.map((point, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${Math.max((point.y / max) * 100, 2)}%` }}
          transition={{ duration: 0.5, delay: i * 0.015 }}
          title={`${point.y} views · ${new Date(point.x).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric" })}`}
          className="min-w-[4px] flex-1 rounded-t-[3px] bg-foreground/80"
        />
      ))}
    </div>
  );
}

export function MetricTable({ title, rows }: { title: string; rows: MetricRow[] }) {
  const max = Math.max(...rows.map((r) => r.y), 1);
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
        {title}
      </p>
      {rows.length === 0 ? (
        <p className="mt-3 text-[12px] text-faint">nothing yet</p>
      ) : (
        <div className="mt-3 flex flex-col gap-1.5">
          {rows.slice(0, 8).map((row, i) => (
            <div key={i} className="relative overflow-hidden rounded-md">
              <div
                className="absolute inset-y-0 left-0 bg-panel-hover"
                style={{ width: `${(row.y / max) * 100}%` }}
              />
              <div className="relative flex items-baseline justify-between gap-3 px-2 py-1">
                <span className="truncate text-[12px] text-muted">
                  {row.x || "(none)"}
                </span>
                <span className="shrink-0 font-mono text-[11.5px] text-foreground">
                  {row.y.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AnalyticsTab() {
  const [range, setRange] = useState<Range>("7d");
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [series, setSeries] = useState<Point[] | null>(null);
  const [events, setEvents] = useState<MetricRow[]>([]);
  const [pages, setPages] = useState<MetricRow[]>([]);
  const [referrers, setReferrers] = useState<MetricRow[]>([]);
  const [countries, setCountries] = useState<MetricRow[]>([]);
  const [live, setLive] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (r: Range) => {
    setLoading(true);
    const get = (qs: string) =>
      fetch(`/api/admin/analytics?range=${r}&${qs}`).then((res) => res.json());
    try {
      const [s, p, ev, pg, rf, co, lv] = await Promise.all([
        get("type=stats"),
        get("type=series"),
        get("type=metrics&metric=event"),
        get("type=metrics&metric=url"),
        get("type=metrics&metric=referrer"),
        get("type=metrics&metric=country"),
        fetch("/api/live").then((res) => res.json()),
      ]);
      if (s.configured === false) {
        setConfigured(false);
        return;
      }
      setConfigured(true);
      setStats(s.data ?? {});
      setSeries(
        (p.data?.pageviews ?? []).map((point: Point) => ({
          x: point.x,
          y: point.y,
        }))
      );
      setEvents(ev.data ?? []);
      setPages(pg.data ?? []);
      setReferrers(rf.data ?? []);
      setCountries(co.data ?? []);
      setLive(lv.active);
    } catch {
      setConfigured((prev) => prev ?? false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(range);
  }, [range, load]);

  if (configured === null) {
    return <Loader2 className="mx-auto mt-10 h-4 w-4 animate-spin text-muted" />;
  }

  if (configured === false) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6">
        <h3 className="text-[15px] font-medium text-foreground">
          Umami isn&apos;t wired up yet
        </h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-[13px] font-light leading-relaxed text-muted">
          <li>
            Create a free account at{" "}
            <a
              href="https://cloud.umami.is"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-accent underline underline-offset-2"
            >
              cloud.umami.is <ExternalLink className="h-3 w-3" />
            </a>{" "}
            and add <code className="font-mono">shivrajput.com</code> as a website.
          </li>
          <li>
            Put the website ID in{" "}
            <code className="font-mono">NEXT_PUBLIC_UMAMI_WEBSITE_ID</code>.
          </li>
          <li>
            Create an API key (account → API keys) and put it in{" "}
            <code className="font-mono">UMAMI_API_KEY</code>.
          </li>
          <li>Redeploy. Charts appear here; the live count appears in the menu bar.</li>
        </ol>
      </div>
    );
  }

  const uniques = num(stats?.visitors as never) || num(stats?.uniques as never);
  const views = num(stats?.pageviews as never);
  const visits = num(stats?.visits as never) || uniques;
  const totalTime = num(stats?.totaltime as never);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
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
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-faint" />}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label="Unique visitors" value={uniques.toLocaleString()} />
        <Kpi label="Page views" value={views.toLocaleString()} />
        <Kpi label="Visits" value={visits.toLocaleString()} />
        <Kpi
          label="Avg visit"
          value={formatDuration(visits > 0 ? totalTime / visits : 0)}
        />
      </div>

      {series && series.length > 0 && (
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
            Page views · {range}
          </p>
          <div className="mt-3">
            <Bars points={series} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <MetricTable title="Events — what they clicked" rows={events} />
        <MetricTable title="Pages" rows={pages} />
        <MetricTable title="Referrers" rows={referrers} />
        <MetricTable title="Countries" rows={countries} />
      </div>

      <p className="handwritten rotate-[-1deg] self-end text-base text-faint">
        resume_click is the one you care about, be honest
      </p>
    </div>
  );
}
