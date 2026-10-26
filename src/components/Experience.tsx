"use client";

import { motion } from "framer-motion";
import { Building2, CalendarDays, MapPin } from "lucide-react";
import { experience } from "@/lib/data";
import { education } from "@/lib/human-data";

const EASE = [0.25, 1, 0.5, 1] as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/** `**bold**` → <strong>; lets the data file mark the numbers that matter. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 ? (
          <strong key={i} className="font-medium text-foreground">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </>
  );
}

export function ExperienceContent() {
  return (
    /* container query, not viewport — the stage width changes with the rail */
    <div className="@container">
      <div className="grid grid-cols-1 items-start gap-10 p-6 @4xl:grid-cols-[1.6fr_1fr]">
        {/* ── left: the role, readable top to bottom ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex min-w-0 flex-col"
        >
          <motion.div variants={fadeUp}>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-faint">
              Experience
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tighter text-foreground">
              {experience.role} <span className="text-faint">at</span>{" "}
              <span className="whitespace-nowrap">
                {experience.company}
                <span className="text-accent">.</span>
              </span>
            </h2>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px] text-muted">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-faint" strokeWidth={1.5} />
                {experience.period}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-faint" strokeWidth={1.5} />
                {experience.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-faint" strokeWidth={1.5} />
                {experience.product}
              </span>
            </div>
            <p className="mt-5 max-w-2xl text-[14.5px] font-light leading-relaxed text-muted">
              {experience.blurb}
            </p>
          </motion.div>

          {/* impact — the outcomes, before the how */}
          <motion.div
            variants={fadeUp}
            className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line @xl:grid-cols-3"
          >
            {experience.impact.map((item) => (
              <div key={item.label} className="bg-surface px-4 py-4">
                <p className="text-xl font-medium tabular-nums tracking-tight text-foreground">
                  {item.value}
                </p>
                <p className="mt-1 text-[12px] leading-snug text-muted">
                  {item.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* what was built, grouped by discipline */}
          <div className="mt-4 flex flex-col">
            {experience.areas.map((area, i) => (
              <motion.section
                key={area.title}
                variants={fadeUp}
                className="border-b border-line py-7 last:border-b-0 last:pb-0"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-[11px] text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[17px] font-medium tracking-tight text-foreground">
                    {area.title}
                  </h3>
                  <span className="text-[13px] font-light text-faint">
                    — {area.summary}
                  </span>
                </div>

                <ul className="mt-4 flex flex-col gap-3">
                  {area.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span
                        className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-foreground/40"
                        aria-hidden
                      />
                      <p className="text-[14px] font-light leading-relaxed text-muted">
                        <Rich text={point} />
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-1.5 pl-4">
                  {area.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10.5px] text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        </motion.div>

        {/* ── right: the receipt (grab it) ─────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: 2 }}
          whileHover={{ rotate: 0, scale: 1.02 }}
          drag
          dragSnapToOrigin
          dragElastic={0.5}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 16 }}
          whileDrag={{ rotate: -2, scale: 1.04, zIndex: 30 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="mx-auto w-full max-w-sm cursor-grab font-mono text-[12.5px] leading-relaxed active:cursor-grabbing"
        >
          <div className="border border-line bg-surface px-7 pb-6 pt-7 shadow-[0_8px_40px_rgba(0,0,0,0.07)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
            <div className="text-center">
              <p className="text-base font-semibold tracking-widest text-foreground">
                MEDIKZO
              </p>
              <p className="mt-1 text-[11px] uppercase text-faint">
                {experience.location}
              </p>
              <p className="mt-0.5 text-[11px] text-faint">{experience.period}</p>
            </div>

            <div className="dashed-row my-4" />

            <div className="flex justify-between text-muted">
              <span>ROLE</span>
              <span className="text-foreground">{experience.role}</span>
            </div>
            <div className="mt-1 flex justify-between text-muted">
              <span>SOURCED</span>
              <span className="text-foreground">{experience.via}</span>
            </div>

            <div className="dashed-row my-4" />

            {experience.receipt.map(([label, value]) => (
              <div key={label} className="flex justify-between py-1">
                <span className="text-muted">{label}</span>
                <span className="text-foreground">{value}</span>
              </div>
            ))}

            <div className="dashed-row my-4" />

            <div className="flex justify-between text-foreground">
              <span className="font-semibold">TOTAL · {experience.receiptTotal[0]}</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {experience.receiptTotal[1]}
              </span>
            </div>

            <div className="dashed-row my-4" />

            <div className="barcode mx-auto h-10 w-44 opacity-80" aria-hidden />
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.25em] text-faint">
              paid in shipped features
            </p>
          </div>
          <p className="handwritten mt-5 rotate-[-2deg] text-center text-xl">
            keep the receipt — you can grab it too
          </p>

          {/* ── education ── */}
          <div className="mt-10 font-mono text-[12px]">
            <p className="text-[11px] uppercase tracking-[0.25em] text-faint">
              Education
            </p>
            <div className="mt-4 flex flex-col">
              {education.map((entry, i) => (
                <motion.div
                  key={entry.place}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.5 + i * 0.15 }}
                  className="group relative flex gap-4 pb-6 last:pb-0"
                >
                  <div className="relative flex w-4 shrink-0 justify-center">
                    {i < education.length - 1 && (
                      <span className="absolute top-3 h-full w-px bg-line" />
                    )}
                    <span className="relative z-10 mt-1 h-2.5 w-2.5 rounded-full border-2 border-accent bg-background transition-colors duration-300 group-hover:bg-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10.5px] uppercase tracking-wider text-faint">
                      {entry.period}
                    </p>
                    <p className="mt-0.5 font-sans text-[14px] font-medium tracking-tight text-foreground">
                      {entry.place}
                    </p>
                    <p className="mt-0.5 text-muted">{entry.detail}</p>
                    <p className="handwritten mt-1 rotate-[-1deg] font-sans text-[13px] text-faint">
                      {entry.aside}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
