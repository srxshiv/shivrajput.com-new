"use client";

import { motion } from "framer-motion";
import { Check, ArrowUpRight, Download } from "lucide-react";
import { site, letter } from "@/lib/data";
import type { Mode } from "./os/Gate";

const EASE = [0.25, 1, 0.5, 1] as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/** The cover letter — greeting adapts to whoever's reading. */
export function CoverLetter({ mode }: { mode: Mode }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="mx-auto flex max-w-xl flex-col gap-5 p-7"
    >
      <motion.p variants={fadeUp} className="font-mono text-[11px] text-faint">
        # README.for-{mode}s.md
      </motion.p>

      <motion.p
        variants={fadeUp}
        className="text-xl font-medium tracking-tight text-foreground"
      >
        {letter.greetings[mode]}
      </motion.p>

      {letter.paragraphs.map((paragraph, i) => (
        <motion.p
          key={i}
          variants={fadeUp}
          className="text-[14.5px] font-light leading-relaxed text-muted"
        >
          {paragraph}
        </motion.p>
      ))}

      {/* the checklist — recruiters love checklists */}
      <motion.div
        variants={fadeUp}
        className="rounded-xl border border-line bg-surface p-5"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
          tl;dr
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {letter.checklist.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.9 + i * 0.12 }}
              className="flex items-center gap-2.5 text-[13px] text-muted"
            >
              <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2.5} />
              {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div variants={fadeUp} className="flex items-center gap-4">
        <span className="handwritten rotate-[-3deg] text-2xl text-foreground">
          — Shiv
        </span>
        <span className="handwritten text-sm text-faint">
          (yes, i wrote this. the site just renders it)
        </span>
      </motion.div>

      <motion.div variants={fadeUp} className="mt-1 flex items-center gap-3">
        <motion.a
          href={`mailto:${site.email}`}
          whileHover={{ scale: 1.04, rotate: -1 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 300, damping: 16 }}
          className="flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-semibold text-background"
        >
          {site.email}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </motion.a>
        <motion.a
          href={site.resume}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.04, rotate: 1 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 300, damping: 16 }}
          className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-[13px] font-medium text-muted transition-colors duration-300 hover:border-foreground/30 hover:text-foreground"
        >
          <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
          resume.pdf
        </motion.a>
      </motion.div>
    </motion.div>
  );
}
