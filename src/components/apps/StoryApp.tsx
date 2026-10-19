"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import { story } from "@/lib/human-data";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/settings-shared";

const EASE = [0.25, 1, 0.5, 1] as const;

/** Local-time widget with a sky gradient that follows the actual hour. */
function SkyClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const hour = now
    ? Number(
        new Intl.DateTimeFormat("en-IN", {
          hour: "numeric",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }).format(now)
      )
    : 12;

  const sky =
    hour >= 5 && hour < 8
      ? "from-rose-300/70 via-amber-200/60 to-sky-300/50" // dawn
      : hour >= 8 && hour < 17
        ? "from-sky-300/60 via-sky-200/50 to-amber-100/40" // day
        : hour >= 17 && hour < 20
          ? "from-amber-400/60 via-rose-300/50 to-indigo-400/40" // dusk
          : "from-indigo-900/60 via-slate-800/50 to-indigo-950/60"; // night

  const label =
    hour >= 5 && hour < 8
      ? "early. why are we awake"
      : hour >= 8 && hour < 12
        ? "morning in Dehradun"
        : hour >= 12 && hour < 17
          ? "afternoon in Dehradun"
          : hour >= 17 && hour < 20
            ? "golden hour over the hills"
            : hour >= 20 && hour < 24
              ? "night shift begins"
              : "deep night. peak commit hours";

  return (
    <div
      className={`relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-gradient-to-br p-5 ${sky}`}
    >
      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/70">
        <MapPin className="h-3 w-3" /> Dehradun, Uttarakhand
      </div>
      <div>
        <p className="font-mono text-3xl font-medium tabular-nums tracking-tight text-foreground">
          {now
            ? now.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "Asia/Kolkata",
              })
            : "—:—"}
        </p>
        <p className="mt-1 text-[12px] font-light text-foreground/70">{label}</p>
      </div>
    </div>
  );
}

/** The hero drifts gently toward the cursor — kinetic, not gimmicky. */
export function StoryApp() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const wrapRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const hx = useSpring(mx, { stiffness: 50, damping: 16 });
  const hy = useSpring(my, { stiffness: 50, damping: 16 });

  useEffect(() => {
    let alive = true;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((json) => alive && json.settings && setSettings(json.settings))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 14);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 10);
  };

  const obsession = settings.obsession ?? DEFAULT_SETTINGS.obsession;

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      className="mx-auto flex max-w-2xl flex-col gap-8 p-7 md:p-9"
    >
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent"
        >
          {story.kicker}
        </motion.p>
        <motion.h1
          style={{ x: hx, y: hy }}
          className="mt-3 text-6xl font-medium leading-[0.95] tracking-tighter text-foreground md:text-7xl"
        >
          {story.heroLines.map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.15 }}
              className="block"
            >
              {line}
            </motion.span>
          ))}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
          className="handwritten mt-4 rotate-[-1.5deg] text-xl text-faint"
        >
          {story.sub}
        </motion.p>
      </div>

      <div className="flex flex-col gap-4">
        {story.paragraphs.map((paragraph, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.6 + i * 0.12 }}
            className="text-[14.5px] font-light leading-relaxed text-muted"
          >
            {paragraph}
          </motion.p>
        ))}
      </div>

      {/* ── the live-ish bento ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 1 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <div className="min-h-[150px]">
          <SkyClock />
        </div>
        <div className="flex min-h-[150px] flex-col justify-between rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
            <Sparkles className="h-3 w-3 text-accent" /> current obsession
          </div>
          <div>
            <p className="text-lg font-medium tracking-tight text-foreground">
              {obsession.title}
            </p>
            <p className="mt-1 text-[12px] font-light leading-relaxed text-muted">
              {obsession.note}
            </p>
          </div>
        </div>
      </motion.div>

      <p className="handwritten rotate-[1deg] pb-2 text-center text-lg text-faint">
        the polaroids next door are draggable, by the way →
      </p>
    </div>
  );
}
