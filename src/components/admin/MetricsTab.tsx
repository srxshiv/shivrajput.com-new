"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";

type Metric = {
  id: string;
  kind: string;
  value: string;
  label: string | null;
  note: string | null;
  order: number;
};

const inputCls =
  "rounded-xl border border-line bg-background px-3.5 py-2 text-[13px] text-foreground outline-none focus:border-foreground/25";

export function MetricsTab() {
  const [metrics, setMetrics] = useState<Metric[] | null>(null);
  const [draft, setDraft] = useState({
    id: "",
    kind: "number",
    value: "",
    label: "",
    note: "",
    order: 0,
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/metrics");
    const data = await res.json();
    setMetrics(data.metrics ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/admin/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMessage(data.error ?? "Could not save.");
      return;
    }
    setMessage("Saved.");
    setDraft({ id: "", kind: draft.kind, value: "", label: "", note: "", order: 0 });
    load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/metrics?id=${id}`, { method: "DELETE" });
    load();
  };

  const numbers = (metrics ?? []).filter((m) => m.kind === "number");
  const tech = (metrics ?? []).filter((m) => m.kind === "tech");

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="text-[15px] font-medium tracking-tight text-foreground">
          {draft.id ? "Edit tile" : "New tile"}
        </h3>
        <p className="mt-1 text-[12.5px] font-light text-muted">
          <span className="font-mono">number</span> tiles count themselves up
          (&quot;229+ endpoints&quot;); <span className="font-mono">tech</span>{" "}
          tiles are skill chips. The note appears on hover as a footnote.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[110px_1fr_1fr_80px]">
          <select
            value={draft.kind}
            onChange={(e) => setDraft((d) => ({ ...d, kind: e.target.value }))}
            className={`${inputCls} font-mono`}
          >
            <option value="number">number</option>
            <option value="tech">tech</option>
          </select>
          <input
            value={draft.value}
            onChange={(e) => setDraft((d) => ({ ...d, value: e.target.value }))}
            placeholder={draft.kind === "number" ? "229+" : "TypeScript"}
            className={inputCls}
          />
          <input
            value={draft.label}
            onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
            placeholder={draft.kind === "number" ? "API endpoints" : "label (optional)"}
            className={inputCls}
          />
          <input
            type="number"
            value={draft.order}
            onChange={(e) =>
              setDraft((d) => ({ ...d, order: Number(e.target.value) || 0 }))
            }
            className={inputCls}
          />
        </div>
        <textarea
          value={draft.note}
          onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
          placeholder="Hover footnote — where this number comes from"
          rows={2}
          className={`${inputCls} mt-3 w-full resize-y`}
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={save}
            disabled={busy || !draft.value}
            className="flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-[13px] font-semibold text-background disabled:opacity-40"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : draft.id ? <Save className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {draft.id ? "Update" : "Add tile"}
          </button>
          {draft.id && (
            <button
              onClick={() =>
                setDraft({ id: "", kind: "number", value: "", label: "", note: "", order: 0 })
              }
              className="text-[12px] text-muted underline underline-offset-4"
            >
              cancel
            </button>
          )}
          {message && <span className="font-mono text-[11px] text-muted">{message}</span>}
        </div>
      </div>

      {metrics === null ? (
        <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted" />
      ) : (
        [
          ["Numbers", numbers],
          ["Tech & skills", tech],
        ].map(([title, rows]) => (
          <div key={title as string}>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
              {title as string} · {(rows as Metric[]).length}
            </p>
            <div className="flex flex-col gap-1.5">
              {(rows as Metric[]).map((metric) => (
                <div key={metric.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-2.5">
                  <span className="min-w-0 flex-1 truncate text-[13px] text-foreground">
                    <span className="font-mono font-semibold">{metric.value}</span>
                    {metric.label && <span className="text-muted"> · {metric.label}</span>}
                    {metric.note && (
                      <span className="text-[11.5px] text-faint"> — {metric.note}</span>
                    )}
                  </span>
                  <button
                    onClick={() =>
                      setDraft({
                        id: metric.id,
                        kind: metric.kind,
                        value: metric.value,
                        label: metric.label ?? "",
                        note: metric.note ?? "",
                        order: metric.order,
                      })
                    }
                    className="rounded-full border border-line px-3 py-1 text-[12px] text-muted transition-colors hover:text-foreground"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(metric.id)}
                    aria-label="Delete"
                    className="rounded-full border border-line p-1.5 text-faint transition-colors hover:border-red-400/50 hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
