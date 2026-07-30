"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  LogOut,
  Plus,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Brain,
  PenLine,
  StickyNote,
  Lock,
} from "lucide-react";

const EASE = [0.25, 1, 0.5, 1] as const;

type ContextEntry = {
  id: string;
  key: string;
  label: string | null;
  content: string;
  order: number;
};

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  imageUrl: string | null;
  body: string;
  published: boolean;
  createdAt: string;
};

type Note = {
  id: string;
  author: string | null;
  body: string;
  color: string;
  hidden: boolean;
  createdAt: string;
};

type Tab = "context" | "blog" | "notes";

/* ─────────────────────────── login ─────────────────────────── */

function Login({ onAuthed }: { onAuthed: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) onAuthed();
      else setError(data.error ?? "Nope.");
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center px-6">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-7"
      >
        <Lock className="h-5 w-5 text-faint" strokeWidth={1.5} />
        <h1 className="mt-4 text-2xl font-medium tracking-tighter text-foreground">
          ShivOS admin
        </h1>
        <p className="mt-1.5 text-[13px] font-light text-muted">
          Teach Dobby, write posts, moderate the wall.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          autoFocus
          className="mt-5 w-full rounded-xl border border-line bg-background px-4 py-2.5 text-[14px] text-foreground outline-none focus:border-foreground/25"
        />
        {error && (
          <p className="mt-2 font-mono text-[11px] text-red-500">{error}</p>
        )}
        <button
          type="submit"
          disabled={busy || !password}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-[13px] font-semibold text-background disabled:opacity-40"
        >
          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Unlock
        </button>
      </motion.form>
    </div>
  );
}

/* ───────────────────────── context tab ─────────────────────── */

const CONTEXT_SUGGESTIONS = [
  "summary",
  "skills",
  "experience",
  "projects",
  "education",
  "contact",
  "hobbies",
  "future_plans",
];

function ContextTab() {
  const [entries, setEntries] = useState<ContextEntry[] | null>(null);
  const [draft, setDraft] = useState({ key: "", label: "", content: "", order: 0 });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/context");
    const data = await res.json();
    setEntries(data.entries ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (entry: {
    key: string;
    label: string;
    content: string;
    order: number;
  }) => {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setMessage(data.error ?? "Could not save.");
      return false;
    }
    setMessage(`Saved "${entry.key}" — Dobby knows it now.`);
    await load();
    return true;
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/context?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* new entry */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="text-[15px] font-medium tracking-tight text-foreground">
          Add / update a context block
        </h3>
        <p className="mt-1 text-[12.5px] font-light text-muted">
          One topic per block. Saving an existing key overwrites it. Dobby reads
          all of these before answering.
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {CONTEXT_SUGGESTIONS.map((k) => (
            <button
              key={k}
              onClick={() => setDraft((d) => ({ ...d, key: k }))}
              className="rounded-full border border-line bg-background px-2.5 py-1 font-mono text-[10.5px] text-muted transition-colors hover:border-foreground/25 hover:text-foreground"
            >
              {k}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_90px]">
          <input
            value={draft.key}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
              }))
            }
            placeholder="key (e.g. skills)"
            className="rounded-xl border border-line bg-background px-3.5 py-2 font-mono text-[13px] text-foreground outline-none focus:border-foreground/25"
          />
          <input
            value={draft.label}
            onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
            placeholder="label (optional)"
            className="rounded-xl border border-line bg-background px-3.5 py-2 text-[13px] text-foreground outline-none focus:border-foreground/25"
          />
          <input
            type="number"
            value={draft.order}
            onChange={(e) =>
              setDraft((d) => ({ ...d, order: Number(e.target.value) || 0 }))
            }
            placeholder="order"
            className="rounded-xl border border-line bg-background px-3.5 py-2 font-mono text-[13px] text-foreground outline-none focus:border-foreground/25"
          />
        </div>

        <textarea
          value={draft.content}
          onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
          rows={6}
          placeholder="Everything Dobby should know about this topic. Write it as facts — bullet points are fine."
          className="mt-3 w-full resize-y rounded-xl border border-line bg-background px-3.5 py-3 text-[13px] leading-relaxed text-foreground outline-none focus:border-foreground/25"
        />

        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={async () => {
              const ok = await save(draft);
              if (ok) setDraft({ key: "", label: "", content: "", order: 0 });
            }}
            disabled={saving || !draft.key || draft.content.trim().length < 2}
            className="flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-[13px] font-semibold text-background disabled:opacity-40"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            Save block
          </button>
          {message && (
            <span className="font-mono text-[11px] text-muted">{message}</span>
          )}
        </div>
      </div>

      {/* existing */}
      {entries === null ? (
        <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted" />
      ) : entries.length === 0 ? (
        <p className="text-center text-[13px] text-muted">
          No context yet — Dobby is a blank slate.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <EntryEditor
              key={entry.id}
              entry={entry}
              onSave={save}
              onDelete={() => remove(entry.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EntryEditor({
  entry,
  onSave,
  onDelete,
}: {
  entry: ContextEntry;
  onSave: (e: {
    key: string;
    label: string;
    content: string;
    order: number;
  }) => Promise<boolean>;
  onDelete: () => void;
}) {
  const [content, setContent] = useState(entry.content);
  const [label, setLabel] = useState(entry.label ?? "");
  const [order, setOrder] = useState(entry.order);
  const [busy, setBusy] = useState(false);
  const dirty =
    content !== entry.content ||
    label !== (entry.label ?? "") ||
    order !== entry.order;

  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-line bg-background px-2.5 py-1 font-mono text-[11px] text-accent">
          {entry.key}
        </span>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="label"
          className="min-w-0 flex-1 rounded-lg border border-line bg-background px-2.5 py-1 text-[12px] text-foreground outline-none focus:border-foreground/25"
        />
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value) || 0)}
          className="w-16 rounded-lg border border-line bg-background px-2 py-1 font-mono text-[12px] text-foreground outline-none focus:border-foreground/25"
        />
        <button
          onClick={async () => {
            setBusy(true);
            await onSave({ key: entry.key, label, content, order });
            setBusy(false);
          }}
          disabled={!dirty || busy}
          className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-[12px] text-muted transition-colors hover:text-foreground disabled:opacity-30"
        >
          {busy ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Save className="h-3 w-3" />
          )}
          Save
        </button>
        <button
          onClick={onDelete}
          aria-label={`Delete ${entry.key}`}
          className="rounded-full border border-line p-1.5 text-faint transition-colors hover:border-red-400/50 hover:text-red-500"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        className="mt-3 w-full resize-y rounded-xl border border-line bg-background px-3.5 py-3 text-[13px] leading-relaxed text-foreground outline-none focus:border-foreground/25"
      />
    </div>
  );
}

/* ────────────────────────── blog tab ───────────────────────── */

const EMPTY_POST = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  imageUrl: "",
  body: "",
  published: true,
};

function BlogTab() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [draft, setDraft] = useState({ ...EMPTY_POST });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/blog");
    const data = await res.json();
    setPosts(data.posts ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/admin/blog", {
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
    setMessage(draft.id ? "Updated." : "Published.");
    setDraft({ ...EMPTY_POST });
    load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="text-[15px] font-medium tracking-tight text-foreground">
          {draft.id ? "Edit post" : "New post"}
        </h3>
        <p className="mt-1 text-[12.5px] font-light text-muted">
          Body is markdown — <code className="font-mono">## headings</code>,
          <code className="font-mono"> **bold**</code>,
          <code className="font-mono"> `code`</code>, lists, links, images and
          tables all render.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder="Title"
            className="rounded-xl border border-line bg-background px-3.5 py-2 text-[14px] text-foreground outline-none focus:border-foreground/25"
          />
          <input
            value={draft.slug}
            onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
            placeholder="slug (auto from title if blank)"
            className="rounded-xl border border-line bg-background px-3.5 py-2 font-mono text-[13px] text-foreground outline-none focus:border-foreground/25"
          />
          <input
            value={draft.imageUrl}
            onChange={(e) => setDraft((d) => ({ ...d, imageUrl: e.target.value }))}
            placeholder="cover image URL (optional)"
            className="rounded-xl border border-line bg-background px-3.5 py-2 text-[13px] text-foreground outline-none focus:border-foreground/25 sm:col-span-2"
          />
          <input
            value={draft.excerpt}
            onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
            placeholder="excerpt / subtitle (optional)"
            className="rounded-xl border border-line bg-background px-3.5 py-2 text-[13px] text-foreground outline-none focus:border-foreground/25 sm:col-span-2"
          />
        </div>

        <textarea
          value={draft.body}
          onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
          rows={12}
          placeholder={"## Hello\n\nWrite in **markdown** here."}
          className="mt-3 w-full resize-y rounded-xl border border-line bg-background px-3.5 py-3 font-mono text-[13px] leading-relaxed text-foreground outline-none focus:border-foreground/25"
        />

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-[13px] text-muted">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) =>
                setDraft((d) => ({ ...d, published: e.target.checked }))
              }
            />
            published
          </label>
          <button
            onClick={save}
            disabled={busy || !draft.title || !draft.body.trim()}
            className="flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-[13px] font-semibold text-background disabled:opacity-40"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {draft.id ? "Update post" : "Publish"}
          </button>
          {draft.id && (
            <button
              onClick={() => setDraft({ ...EMPTY_POST })}
              className="text-[12px] text-muted underline underline-offset-4"
            >
              cancel edit
            </button>
          )}
          {message && (
            <span className="font-mono text-[11px] text-muted">{message}</span>
          )}
        </div>
      </div>

      {posts === null ? (
        <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted" />
      ) : posts.length === 0 ? (
        <p className="text-center text-[13px] text-muted">No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium text-foreground">
                  {post.title}
                </span>
                <span className="block truncate font-mono text-[11px] text-faint">
                  /{post.slug} · {post.published ? "published" : "draft"}
                </span>
              </span>
              <button
                onClick={() =>
                  setDraft({
                    id: post.id,
                    title: post.title,
                    slug: post.slug,
                    excerpt: post.excerpt ?? "",
                    imageUrl: post.imageUrl ?? "",
                    body: post.body,
                    published: post.published,
                  })
                }
                className="rounded-full border border-line px-3 py-1 text-[12px] text-muted transition-colors hover:text-foreground"
              >
                Edit
              </button>
              <button
                onClick={() => remove(post.id)}
                aria-label={`Delete ${post.title}`}
                className="rounded-full border border-line p-1.5 text-faint transition-colors hover:border-red-400/50 hover:text-red-500"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────── notes tab ──────────────────────── */

function NotesTab() {
  const [notes, setNotes] = useState<Note[] | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/notes");
    const data = await res.json();
    setNotes(data.notes ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (note: Note) => {
    await fetch("/api/admin/notes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: note.id, hidden: !note.hidden }),
    });
    load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/notes?id=${id}`, { method: "DELETE" });
    load();
  };

  if (notes === null)
    return <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted" />;
  if (notes.length === 0)
    return (
      <p className="text-center text-[13px] text-muted">
        Nobody has left a note yet.
      </p>
    );

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[12.5px] font-light text-muted">
        Hide anything unkind — hidden notes disappear from the public wall but
        stay here.
      </p>
      {notes.map((note) => (
        <div
          key={note.id}
          className={`flex items-start gap-3 rounded-xl border border-line bg-surface px-4 py-3 ${
            note.hidden ? "opacity-50" : ""
          }`}
        >
          <span className="min-w-0 flex-1">
            <span className="block whitespace-pre-wrap text-[13px] text-foreground">
              {note.body}
            </span>
            <span className="mt-1 block font-mono text-[10.5px] text-faint">
              {note.author || "anonymous"} ·{" "}
              {new Date(note.createdAt).toLocaleString("en-IN")} · {note.color}
              {note.hidden ? " · hidden" : ""}
            </span>
          </span>
          <button
            onClick={() => toggle(note)}
            aria-label={note.hidden ? "Unhide note" : "Hide note"}
            className="rounded-full border border-line p-1.5 text-faint transition-colors hover:text-foreground"
          >
            {note.hidden ? (
              <Eye className="h-3.5 w-3.5" />
            ) : (
              <EyeOff className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            onClick={() => remove(note.id)}
            aria-label="Delete note"
            className="rounded-full border border-line p-1.5 text-faint transition-colors hover:border-red-400/50 hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────── the panel ───────────────────────── */

export function AdminPanel() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("context");

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => setAuthed(!!d.authed))
      .catch(() => setAuthed(false));
  }, []);

  if (authed === null) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-muted" />
      </div>
    );
  }

  if (!authed) return <Login onAuthed={() => setAuthed(true)} />;

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "context", label: "Dobby's brain", icon: Brain },
    { id: "blog", label: "Blog", icon: PenLine },
    { id: "notes", label: "Visitor notes", icon: StickyNote },
  ];

  return (
    <div className="mx-auto min-h-svh w-full max-w-3xl px-5 py-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tighter text-foreground">
            ShivOS admin
          </h1>
          <p className="font-mono text-[11px] text-faint">
            private · noindex · session expires in 12h
          </p>
        </div>
        <button
          onClick={async () => {
            await fetch("/api/admin/session", { method: "DELETE" });
            setAuthed(false);
          }}
          className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[12.5px] text-muted transition-colors hover:text-foreground"
        >
          <LogOut className="h-3.5 w-3.5" />
          Lock
        </button>
      </header>

      <nav className="mt-7 flex items-center gap-1 rounded-full border border-line bg-surface p-1.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="relative flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2"
          >
            {tab === t.id && (
              <motion.span
                layoutId="admin-tab"
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 flex items-center gap-2 text-[12.5px] font-medium ${
                tab === t.id ? "text-background" : "text-muted"
              }`}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </span>
          </button>
        ))}
      </nav>

      <main className="mt-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            {tab === "context" && <ContextTab />}
            {tab === "blog" && <BlogTab />}
            {tab === "notes" && <NotesTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
