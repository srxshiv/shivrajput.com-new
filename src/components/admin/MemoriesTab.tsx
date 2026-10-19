"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";

type Memory = {
  id: string;
  imageUrl: string | null;
  caption: string;
  rotation: number;
  order: number;
};

const inputCls =
  "rounded-xl border border-line bg-background px-3.5 py-2 text-[13px] text-foreground outline-none focus:border-foreground/25";

const EMPTY = { id: "", caption: "", imageUrl: "", rotation: 0, order: 0 };

export function MemoriesTab() {
  const [memories, setMemories] = useState<Memory[] | null>(null);
  const [draft, setDraft] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/memories");
    const data = await res.json();
    setMemories(data.memories ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/admin/memories", {
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
    setMessage("Pinned.");
    setDraft(EMPTY);
    load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/memories?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="text-[15px] font-medium tracking-tight text-foreground">
          {draft.id ? "Edit memory" : "Pin a memory"}
        </h3>
        <p className="mt-1 text-[12.5px] font-light text-muted">
          Polaroids on the human side&apos;s memory board. Image URL is
          optional — caption-only cards render as handwritten notes.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <input
            value={draft.caption}
            onChange={(e) => setDraft((d) => ({ ...d, caption: e.target.value }))}
            placeholder="caption (required)"
            className={inputCls}
          />
          <input
            value={draft.imageUrl}
            onChange={(e) => setDraft((d) => ({ ...d, imageUrl: e.target.value }))}
            placeholder="image url (optional)"
            className={inputCls}
          />
          <input
            type="number"
            value={draft.rotation}
            onChange={(e) =>
              setDraft((d) => ({ ...d, rotation: Number(e.target.value) }))
            }
            placeholder="tilt in degrees (−12 to 12)"
            className={inputCls}
          />
          <input
            type="number"
            value={draft.order}
            onChange={(e) =>
              setDraft((d) => ({ ...d, order: Number(e.target.value) }))
            }
            placeholder="order"
            className={inputCls}
          />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={save}
            disabled={busy || draft.caption.trim().length === 0}
            className="flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-[13px] font-semibold text-background disabled:opacity-40"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : draft.id ? (
              <Save className="h-3.5 w-3.5" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            {draft.id ? "Save changes" : "Pin it"}
          </button>
          {draft.id && (
            <button
              onClick={() => setDraft(EMPTY)}
              className="text-[12px] text-muted hover:text-foreground"
            >
              cancel edit
            </button>
          )}
          {message && (
            <span className="font-mono text-[11px] text-muted">{message}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {memories === null && (
          <Loader2 className="h-4 w-4 animate-spin text-faint" />
        )}
        {memories?.length === 0 && (
          <p className="text-[13px] font-light text-muted">
            No memories yet — the board shows a gentle empty state.
          </p>
        )}
        {memories?.map((memory) => (
          <div
            key={memory.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-[13.5px] text-foreground">
                {memory.caption}
              </p>
              <p className="mt-0.5 font-mono text-[10.5px] text-faint">
                {memory.imageUrl ? "photo" : "caption-only"} · tilt{" "}
                {memory.rotation}° · order {memory.order}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() =>
                  setDraft({
                    id: memory.id,
                    caption: memory.caption,
                    imageUrl: memory.imageUrl ?? "",
                    rotation: memory.rotation,
                    order: memory.order,
                  })
                }
                className="rounded-full border border-line px-3 py-1 text-[11.5px] text-muted hover:text-foreground"
              >
                edit
              </button>
              <button
                onClick={() => remove(memory.id)}
                aria-label="Delete memory"
                className="rounded-full border border-line p-1.5 text-muted hover:border-red-400/50 hover:text-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
