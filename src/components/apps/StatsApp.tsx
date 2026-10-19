"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, animate, useInView } from "framer-motion";
import { Loader2, Gauge } from "lucide-react";

const EASE = [0.25, 1, 0.5, 1] as const;

type Metric = {
  id: string;
  kind: string;
  value: string;
  label: string | null;
  note: string | null;
};

/** "229+" → animates 0→229 then shows the suffix. Non-numeric renders as-is. */
function CountUp({ value }: { value: string }) {
  const match = /^([\d,.]+)(.*)$/.exec(value.trim());
  const target = match ? Number(match[1].replace(/,/g, "")) : NaN;
  const suffix = match?.[2] ?? "";
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || !Number.isFinite(target)) return;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.25, 1, 0.5, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target]);

  if (!Number.isFinite(target)) {
    return <span ref={ref}>{value}</span>;
  }
  return (
    <span ref={ref}>
      {display.toLocaleString()}
      <span className="text-accent">{suffix}</span>
    </span>
  );
}

function NumberTile({ metric, index }: { metric: Metric; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: index % 3 === 1 ? 0.8 : -0.7 }}
      whileHover={{ rotate: 0, y: -5, scale: 1.03 }}
      transition={{ duration: 0.55, ease: EASE, delay: index * 0.06 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative cursor-default rounded-2xl border border-line bg-surface p-5 shadow-[0_2px_14px_rgba(0,0,0,0.04)] transition-colors duration-300 hover:border-foreground/20 dark:shadow-[0_2px_14px_rgba(0,0,0,0.3)]"
    >
      <p className="font-mono text-3xl font-semibold tracking-tight text-foreground">
        <CountUp value={metric.value} />
      </p>
      {metric.label && (
        <p className="mt-1.5 text-[11px] font-light uppercase tracking-[0.14em] text-faint">
          {metric.label}
        </p>
      )}

      {/* the footnote — appears like a handwritten margin note */}
      <AnimatePresence>
        {hovered && metric.note && (
          <motion.div
            initial={{ opacity: 0, y: 6, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="glass pointer-events-none absolute -top-2 left-3 right-3 z-20 -translate-y-full rounded-xl px-3.5 py-2.5 shadow-[0_12px_36px_rgba(0,0,0,0.16)]"
          >
            <p className="text-[12px] leading-snug text-muted">{metric.note}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TechChip({ metric, index }: { metric: Metric; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ rotate: index % 2 === 0 ? -4 : 4, scale: 1.09, y: -3 }}
      transition={{ type: "spring", stiffness: 320, damping: 16, delay: 0.3 + index * 0.03 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative cursor-default rounded-full border border-line bg-surface px-4 py-2 text-[13px] text-muted transition-colors duration-300 hover:border-accent/40 hover:text-foreground"
    >
      {metric.value}
      <AnimatePresence>
        {hovered && metric.note && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="glass pointer-events-none absolute -top-2 left-1/2 z-20 w-max max-w-[220px] -translate-x-1/2 -translate-y-full rounded-lg px-3 py-2 text-left text-[11.5px] leading-snug text-muted shadow-[0_12px_36px_rgba(0,0,0,0.16)]"
          >
            {metric.note}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}

export function StatsApp() {
  const [metrics, setMetrics] = useState<Metric[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/metrics")
      .then((r) => r.json())
      .then((json) => alive && setMetrics(json.metrics ?? []))
      .catch(() => alive && setMetrics([]));
    return () => {
      alive = false;
    };
  }, []);

  if (metrics === null) {
    return (
      <div className="flex h-full items-center justify-center gap-2 p-10 text-faint">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="font-mono text-[12px]">tallying…</span>
      </div>
    );
  }

  const numbers = metrics.filter((m) => m.kind === "number");
  const tech = metrics.filter((m) => m.kind === "tech");

  if (metrics.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
        <Gauge className="h-8 w-8 text-faint" strokeWidth={1.25} />
        <p className="text-[15px] font-medium text-foreground">
          No numbers yet.
        </p>
        <p className="handwritten rotate-[-2deg] text-xl text-muted">
          add some in /admin — they count themselves up
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 p-6">
      <div>
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            By the numbers
          </h2>
          <p className="handwritten hidden rotate-[-1.5deg] text-base text-faint sm:block">
            hover a tile for the footnote
          </p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {numbers.map((metric, i) => (
            <NumberTile key={metric.id} metric={metric} index={i} />
          ))}
        </div>
      </div>

      {tech.length > 0 && (
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-faint">
            …and the tools that did it
          </h3>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {tech.map((metric, i) => (
              <TechChip key={metric.id} metric={metric} index={i} />
            ))}
          </div>
        </div>
      )}

      <p className="handwritten rotate-[1deg] self-end text-base text-faint">
        every number here survived a fact-check, promise
      </p>
    </div>
  );
}
