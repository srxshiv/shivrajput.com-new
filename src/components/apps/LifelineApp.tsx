"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Trophy, Bug, Flag } from "lucide-react";
import { lifeline, type LifeEvent } from "@/lib/human-data";

const EASE = [0.25, 1, 0.5, 1] as const;

const KIND: Record<
  LifeEvent["kind"],
  { icon: React.ElementType; chip: string; tint: string }
> = {
  win: { icon: Trophy, chip: "win", tint: "text-emerald-600 dark:text-emerald-400" },
  fail: { icon: Bug, chip: "lesson", tint: "text-amber-600 dark:text-amber-400" },
  start: { icon: Flag, chip: "chapter", tint: "text-accent" },
};

const ROW_H = 148;

/** Winding SVG road that draws itself as you scroll the timeline. */
function buildPath(count: number, width: number) {
  let d = `M ${width / 2} 0`;
  for (let i = 0; i < count; i += 1) {
    const y0 = i * ROW_H;
    const x = i % 2 === 0 ? width * 0.82 : width * 0.18;
    const nextMid = width / 2;
    d += ` C ${x} ${y0 + ROW_H * 0.25}, ${x} ${y0 + ROW_H * 0.75}, ${nextMid} ${y0 + ROW_H}`;
  }
  return d;
}

export function LifelineApp() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollerRef });
  const drawn = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  const width = 320;
  const height = lifeline.length * ROW_H;

  return (
    <div ref={scrollerRef} className="h-full overflow-y-auto overscroll-contain">
      <div className="mx-auto max-w-xl px-6 pb-16 pt-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-3xl font-medium tracking-tighter text-foreground">
            the anti-resume.
          </h2>
          <span className="handwritten rotate-[2deg] text-lg text-faint">
            wins AND faceplants
          </span>
        </div>
        <p className="mt-2 text-[13px] font-light text-muted">
          scroll — the road draws itself. like life, it only makes sense
          backwards.
        </p>

        <div className="relative mt-8" style={{ height }}>
          {/* the road */}
          <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden
          >
            <path
              d={buildPath(lifeline.length, width)}
              fill="none"
              stroke="var(--line)"
              strokeWidth="2"
              strokeDasharray="5 7"
            />
            <motion.path
              d={buildPath(lifeline.length, width)}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ pathLength: drawn }}
            />
          </svg>

          {/* the milestones */}
          {lifeline.map((event, i) => {
            const kind = KIND[event.kind];
            const left = i % 2 === 0;
            return (
              <motion.div
                key={`${event.year}-${event.title}`}
                initial={{ opacity: 0, scale: 0.88, y: 22 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ root: scrollerRef, margin: "-60px", once: true }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{ top: i * ROW_H + 18 }}
                className={`absolute w-[62%] md:w-[56%] ${
                  left ? "left-0" : "right-0"
                }`}
              >
                <div
                  className={`rounded-2xl border border-line bg-surface p-4 shadow-[0_6px_24px_rgba(60,40,20,0.08)] ${
                    left ? "rotate-[-0.6deg]" : "rotate-[0.6deg]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10.5px] tracking-wider text-faint">
                      {event.year}
                    </span>
                    <span
                      className={`flex items-center gap-1 rounded-full border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${kind.tint}`}
                    >
                      <kind.icon className="h-2.5 w-2.5" />
                      {kind.chip}
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-[15px] font-medium tracking-tight text-foreground">
                    {event.title}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] font-light leading-relaxed text-muted">
                    {event.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="handwritten mt-6 rotate-[-2deg] text-center text-xl text-faint">
          to be continued — obviously
        </p>
      </div>
    </div>
  );
}
