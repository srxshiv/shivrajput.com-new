"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send, StickyNote } from "lucide-react";

const EASE = [0.25, 1, 0.5, 1] as const;

const COLORS = ["butter", "mint", "sky", "blush", "lilac"] as const;
type Color = (typeof COLORS)[number];

type Note = {
  id: string;
  author: string | null;
  body: string;
  color: string;
  createdAt: string;
};

/** Deterministic tilt per note so re-renders don't jiggle the wall. */
function tiltFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  const steps = [-2.4, -1.5, -0.8, 0.9, 1.6, 2.3];
  return steps[Math.abs(hash) % steps.length];
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function StickyCard({ note }: { note: Note }) {
  const color = (COLORS as readonly string[]).includes(note.color)
    ? note.color
    : "butter";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18, rotate: 0, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, rotate: tiltFor(note.id), scale: 1 }}
      whileHover={{ rotate: 0, scale: 1.04, zIndex: 5 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`note-${color} flex min-h-[132px] break-inside-avoid flex-col gap-2 rounded-[3px] p-4 shadow-[0_4px_14px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.4)]`}
    >
      <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed">
        {note.body}
      </p>
      <div className="mt-auto flex items-baseline justify-between gap-2 pt-1 opacity-70">
        <span className="handwritten truncate text-base">
          {note.author ? `— ${note.author}` : "— anonymous"}
        </span>
        <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider">
          {timeAgo(note.createdAt)}
        </span>
      </div>
    </motion.div>
  );
}

export function NotesApp() {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [color, setColor] = useState<Color>("butter");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justPosted, setJustPosted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/notes")
      .then((r) => r.json())
      .then((data) => alive && setNotes(data.notes ?? []))
      .catch(() => alive && setNotes([]));
    return () => {
      alive = false;
    };
  }, []);

  const submit = async () => {
    const trimmed = body.trim();
    if (trimmed.length < 2 || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: trimmed, author: author.trim(), color }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not pin that note.");
      } else {
        setNotes((prev) => [data.note, ...(prev ?? [])]);
        setBody("");
        setJustPosted(true);
        setTimeout(() => setJustPosted(false), 2600);
      }
    } catch {
      setError("Network hiccup — try again?");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* composer */}
      <div className="shrink-0 border-b border-line bg-surface p-5">
        {/* the sticky and its controls are the same height, so the controls
            column never leaves a bare strip of card beside the note */}
        <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
          <div
            className={`note-${color} flex w-full flex-col rounded-[3px] p-3 shadow-[0_4px_14px_rgba(0,0,0,0.1)] md:w-80 md:shrink-0`}
          >
            <textarea
              ref={textareaRef}
              value={body}
              onChange={(e) => setBody(e.target.value.slice(0, 280))}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
              }}
              rows={3}
              placeholder="leave a note for shiv…"
              aria-label="Your note"
              className="w-full flex-1 resize-none bg-transparent text-[13.5px] leading-relaxed outline-none placeholder:opacity-50"
            />
            <div className="flex items-center justify-between gap-2 pt-1">
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value.slice(0, 28))}
                placeholder="your name (optional)"
                aria-label="Your name, optional"
                className="handwritten min-w-0 flex-1 bg-transparent text-base outline-none placeholder:opacity-50"
              />
              <span className="shrink-0 font-mono text-[9px] opacity-60">
                {body.length}/280
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between gap-3 md:max-w-md">
            {/* the trust notice leads; controls sit on the bottom baseline,
                level with the foot of the sticky note */}
            <p className="text-[12px] font-light leading-relaxed text-muted">
              <span className="text-foreground">This works on trust.</span>{" "}
              Anyone can post here anonymously, so please don&apos;t write
              anything hateful, NSFW, or unkind. Be the reason someone smiles
              today.
            </p>

            <div className="flex items-center gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  aria-label={`${c} note`}
                  aria-pressed={color === c}
                  className={`note-${c} h-6 w-6 rounded-[3px] transition-transform duration-200 hover:scale-110 ${
                    color === c
                      ? "ring-2 ring-foreground/40 ring-offset-2 ring-offset-surface"
                      : ""
                  }`}
                />
              ))}
              <motion.button
                onClick={submit}
                disabled={body.trim().length < 2 || sending}
                whileHover={{ scale: 1.04, rotate: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
                className="ml-auto flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-[13px] font-semibold text-background disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                Pin it
              </motion.button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-[11px] text-red-500"
                >
                  {error}
                </motion.p>
              )}
              {justPosted && (
                <motion.p
                  initial={{ opacity: 0, y: 4, rotate: 0 }}
                  animate={{ opacity: 1, y: 0, rotate: -2 }}
                  exit={{ opacity: 0 }}
                  className="handwritten text-lg text-emerald-600 dark:text-emerald-400"
                >
                  pinned! thank you, genuinely ♡
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* the wall */}
      <div className="flex-1 overflow-y-auto p-5">
        {notes === null ? (
          <div className="flex items-center justify-center gap-2 py-16 text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-mono text-[12px]">reading the wall…</span>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <StickyNote className="h-8 w-8 text-faint" strokeWidth={1.25} />
            <p className="text-[15px] font-medium text-foreground">
              The wall is empty.
            </p>
            <p className="handwritten rotate-[-2deg] text-xl text-muted">
              be the first one — no pressure ↑
            </p>
          </div>
        ) : (
          <div className="columns-2 gap-4 [column-fill:_balance] sm:columns-3 xl:columns-4">
            <AnimatePresence initial={false}>
              {notes.map((note) => (
                <div key={note.id} className="mb-4 break-inside-avoid">
                  <StickyCard note={note} />
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
