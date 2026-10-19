"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";

type Video = {
  id: string;
  title: string;
  url: string;
  note: string | null;
  publishedAt: string | null;
  order: number;
  published: boolean;
};

const inputCls =
  "rounded-xl border border-line bg-background px-3.5 py-2 text-[13px] text-foreground outline-none focus:border-foreground/25";

export function VideosTab() {
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [draft, setDraft] = useState({
    id: "",
    title: "",
    url: "",
    note: "",
    publishedAt: "",
    order: 0,
    published: true,
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/videos");
    const data = await res.json();
    setVideos(data.videos ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/admin/videos", {
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
    setDraft({ id: "", title: "", url: "", note: "", publishedAt: "", order: 0, published: true });
    load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/videos?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="text-[15px] font-medium tracking-tight text-foreground">
          {draft.id ? "Edit video" : "Add a video"}
        </h3>
        <p className="mt-1 text-[12.5px] font-light text-muted">
          Paste a YouTube link — the thumbnail is fetched automatically.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} placeholder="Title" className={inputCls} />
          <input value={draft.url} onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))} placeholder="https://youtube.com/watch?v=…" className={`${inputCls} font-mono`} />
          <input value={draft.note} onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))} placeholder="One-line description (optional)" className={`${inputCls} sm:col-span-2`} />
          <input type="date" value={draft.publishedAt} onChange={(e) => setDraft((d) => ({ ...d, publishedAt: e.target.value }))} className={inputCls} />
          <input type="number" value={draft.order} onChange={(e) => setDraft((d) => ({ ...d, order: Number(e.target.value) || 0 }))} placeholder="Order" className={inputCls} />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <label className="flex items-center gap-2 text-[13px] text-muted">
            <input type="checkbox" checked={draft.published} onChange={(e) => setDraft((d) => ({ ...d, published: e.target.checked }))} />
            published
          </label>
          <button
            onClick={save}
            disabled={busy || !draft.title || !draft.url}
            className="flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-[13px] font-semibold text-background disabled:opacity-40"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : draft.id ? <Save className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {draft.id ? "Update" : "Add video"}
          </button>
          {draft.id && (
            <button
              onClick={() => setDraft({ id: "", title: "", url: "", note: "", publishedAt: "", order: 0, published: true })}
              className="text-[12px] text-muted underline underline-offset-4"
            >
              cancel
            </button>
          )}
          {message && <span className="font-mono text-[11px] text-muted">{message}</span>}
        </div>
      </div>

      {videos === null ? (
        <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted" />
      ) : videos.length === 0 ? (
        <p className="text-center text-[13px] text-muted">
          No videos yet — visitors see a cute empty state.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {videos.map((video) => (
            <div key={video.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium text-foreground">
                  {video.title}
                  {!video.published && (
                    <span className="font-mono text-[11px] text-faint"> · hidden</span>
                  )}
                </span>
                <span className="block truncate font-mono text-[11px] text-faint">{video.url}</span>
              </span>
              <button
                onClick={() =>
                  setDraft({
                    id: video.id,
                    title: video.title,
                    url: video.url,
                    note: video.note ?? "",
                    publishedAt: video.publishedAt ? video.publishedAt.slice(0, 10) : "",
                    order: video.order,
                    published: video.published,
                  })
                }
                className="rounded-full border border-line px-3 py-1 text-[12px] text-muted transition-colors hover:text-foreground"
              >
                Edit
              </button>
              <button onClick={() => remove(video.id)} aria-label="Delete" className="rounded-full border border-line p-1.5 text-faint transition-colors hover:border-red-400/50 hover:text-red-500">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
