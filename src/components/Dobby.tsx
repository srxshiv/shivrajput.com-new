"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Sparkles } from "lucide-react";

const EASE = [0.25, 1, 0.5, 1] as const;

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "what is shiv good at?",
  "tell me about medikzo",
  "is he looking for a job?",
  "what's his coolest project?",
];

const GREETING =
  "Hi hi! Dobby is Shiv's helper — ask me anything about him and I will tell you everything I know.";

/* ─────────────────────── the creature ─────────────────────── */

function DobbyAvatar({
  size = 56,
  talking = false,
}: {
  size?: number;
  talking?: boolean;
}) {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      // irregular blinking reads as alive; a fixed interval reads as a machine
      timeout = setTimeout(
        () => {
          setBlink(true);
          setTimeout(() => setBlink(false), 130);
          schedule();
        },
        2200 + Math.random() * 3200
      );
    };
    schedule();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden
      className="overflow-visible"
    >
      {/* ears */}
      <motion.g
        animate={{ rotate: talking ? [0, -6, 4, 0] : 0 }}
        transition={{ duration: 0.9, repeat: talking ? Infinity : 0 }}
        style={{ originX: "32px", originY: "34px" }}
      >
        <ellipse
          cx="11"
          cy="26"
          rx="7.5"
          ry="14"
          fill="var(--dobby-skin)"
          stroke="var(--dobby-line)"
          strokeWidth="2"
          transform="rotate(-24 11 26)"
        />
        <ellipse
          cx="53"
          cy="26"
          rx="7.5"
          ry="14"
          fill="var(--dobby-skin)"
          stroke="var(--dobby-line)"
          strokeWidth="2"
          transform="rotate(24 53 26)"
        />
      </motion.g>

      {/* body */}
      <path
        d="M20 50c0-6 5.4-9 12-9s12 3 12 9v4H20z"
        fill="var(--dobby-cloth)"
        stroke="var(--dobby-line)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* head */}
      <ellipse
        cx="32"
        cy="30"
        rx="17"
        ry="16"
        fill="var(--dobby-skin)"
        stroke="var(--dobby-line)"
        strokeWidth="2"
      />

      {/* eyes */}
      <g>
        {/* ry is animated only — passing it as an attribute too makes framer
            hand SVG an undefined value on the first paint */}
        <motion.ellipse
          cx="25.5"
          cy="29"
          rx="4.2"
          fill="var(--dobby-line)"
          initial={{ ry: 5 }}
          animate={{ ry: blink ? 0.5 : 5 }}
          transition={{ duration: 0.1 }}
        />
        <motion.ellipse
          cx="38.5"
          cy="29"
          rx="4.2"
          fill="var(--dobby-line)"
          initial={{ ry: 5 }}
          animate={{ ry: blink ? 0.5 : 5 }}
          transition={{ duration: 0.1 }}
        />
        {!blink && (
          <>
            <circle cx="27" cy="27" r="1.5" fill="#fff" />
            <circle cx="40" cy="27" r="1.5" fill="#fff" />
          </>
        )}
      </g>

      {/* blush */}
      <ellipse cx="19.5" cy="35" rx="3" ry="1.8" fill="var(--dobby-blush)" opacity="0.75" />
      <ellipse cx="44.5" cy="35" rx="3" ry="1.8" fill="var(--dobby-blush)" opacity="0.75" />

      {/* mouth */}
      {talking ? (
        <motion.ellipse
          cx="32"
          cy="38.5"
          rx="3"
          fill="var(--dobby-line)"
          initial={{ ry: 1 }}
          animate={{ ry: [1, 2.6, 1.2] }}
          transition={{ duration: 0.45, repeat: Infinity }}
        />
      ) : (
        <path
          d="M28.5 37.5c1.4 1.8 5.6 1.8 7 0"
          stroke="var(--dobby-line)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}

/* ─────────────────────────── chat ─────────────────────────── */

export function Dobby() {
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // one gentle "psst" a few seconds in, then never again
  useEffect(() => {
    const show = setTimeout(() => setNudge(true), 4200);
    const hide = setTimeout(() => setNudge(false), 11000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setNudge(false);
      setTimeout(() => inputRef.current?.focus(), 260);
    }
  }, [open]);

  useEffect(() => {
    // smooth scrolling fights itself when tokens arrive every few ms, which
    // leaves the newest line stranded below the fold — jump instantly instead
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: streaming ? "auto" : "smooth",
    });
  }, [messages, streaming]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || streaming) return;

    const history = [...messages, { role: "user" as const, content: question }];
    // show the user's message AND an empty assistant bubble in the same paint,
    // so the typing dots appear instantly instead of after the fetch resolves
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/dobby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // the greeting isn't a real turn — don't feed it back to the model
          messages: history.filter(
            (m, i) => !(i === 0 && m.role === "assistant")
          ),
        }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setMessages([
          ...history,
          {
            role: "assistant",
            content:
              data.error ??
              "Dobby cannot reach his brain right now. Try again in a moment?",
          },
        ]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: acc }]);
      }
      // flush any trailing multi-byte character left in the decoder
      acc += decoder.decode();
      setMessages([...history, { role: "assistant", content: acc }]);
    } catch {
      setMessages([
        ...history,
        {
          role: "assistant",
          content: "Something went wrong on the way here. One more try?",
        },
      ]);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <>
      {/* ── the floating creature ─────────────────── */}
      <div className="fixed bottom-4 right-4 z-[65] flex flex-col items-end gap-2 md:bottom-5 md:right-5">
        <AnimatePresence>
          {nudge && !open && (
            <motion.button
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: -1.5 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => setOpen(true)}
              className="glass max-w-[210px] rounded-2xl rounded-br-sm px-3.5 py-2 text-left text-[12.5px] leading-snug text-muted shadow-[0_8px_28px_rgba(0,0,0,0.12)]"
            >
              psst — I&apos;m Dobby. Ask me anything about Shiv!
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close Dobby" : "Chat with Dobby about Shiv"}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.08, rotate: -3 }}
          whileTap={{ scale: 0.92 }}
          className="relative flex h-16 w-16 items-center justify-center rounded-full border border-line bg-surface shadow-[0_10px_30px_rgba(0,0,0,0.14)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        >
          <DobbyAvatar size={44} talking={streaming} />
          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
            <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400/70" />
            <span className="relative h-3 w-3 rounded-full border-2 border-surface bg-emerald-500" />
          </span>
        </motion.button>
      </div>

      {/* ── the chat panel ───────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="fixed bottom-24 right-3 z-[66] flex max-h-[min(680px,calc(100svh-130px))] w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-3xl border border-line bg-background shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:w-[400px] md:bottom-28 md:right-5"
          >
            {/* header */}
            <div className="flex shrink-0 items-center gap-3 border-b border-line bg-surface px-4 py-3">
              <DobbyAvatar size={34} talking={streaming} />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold tracking-tight text-foreground">
                  Dobby
                </p>
                <p className="truncate font-mono text-[10px] text-faint">
                  shiv&apos;s helper · only answers about shiv
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex h-7 w-7 items-center justify-center rounded-full text-faint transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* messages */}
            <div ref={listRef} className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex min-w-0 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      // wrap-anywhere keeps long URLs from overflowing the
                      // bubble and getting clipped by the scroll container
                      className={`max-w-[85%] min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-br-sm bg-foreground text-background"
                          : "rounded-bl-sm border border-line bg-surface text-muted"
                      }`}
                    >
                      {msg.content || (
                        <span className="inline-flex gap-1 py-0.5">
                          {[0, 1, 2].map((d) => (
                            <motion.span
                              key={d}
                              animate={{ opacity: [0.25, 1, 0.25] }}
                              transition={{
                                duration: 1.1,
                                repeat: Infinity,
                                delay: d * 0.18,
                              }}
                              className="h-1.5 w-1.5 rounded-full bg-faint"
                            />
                          ))}
                        </span>
                      )}
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* starter chips — only before the first question */}
              {messages.length === 1 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={s}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.15 + i * 0.07 }}
                      whileHover={{ scale: 1.04, rotate: i % 2 ? 1 : -1 }}
                      onClick={() => send(s)}
                      className="rounded-full border border-line bg-surface px-3 py-1.5 text-[11.5px] text-muted transition-colors hover:border-accent/40 hover:text-foreground"
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* composer */}
            <div className="shrink-0 border-t border-line bg-surface p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, 500))}
                  placeholder="ask about shiv…"
                  aria-label="Ask Dobby about Shiv"
                  className="min-w-0 flex-1 rounded-full border border-line bg-background px-4 py-2.5 text-[13px] text-foreground outline-none transition-colors placeholder:text-faint focus:border-foreground/25"
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || streaming}
                  whileHover={{ scale: 1.08, rotate: -4 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Send"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background disabled:opacity-35"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </form>
              <p className="mt-2 flex items-center gap-1.5 px-1 font-mono text-[9.5px] leading-relaxed text-faint">
                <Sparkles className="h-2.5 w-2.5 shrink-0" />
                dobby only knows what shiv taught him — he may get things wrong
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
