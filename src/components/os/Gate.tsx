"use client";

import { motion } from "framer-motion";
import { Briefcase, Code2, Compass } from "lucide-react";

const EASE = [0.25, 1, 0.5, 1] as const;

export type Mode = "recruiter" | "developer" | "visitor";

const options: {
  id: Mode;
  icon: React.ElementType;
  title: string;
  blurb: string;
  tilt: number;
}[] = [
  {
    id: "recruiter",
    icon: Briefcase,
    title: "Recruiter",
    blurb: "cover letter, experience & receipts — up front",
    tilt: -2,
  },
  {
    id: "developer",
    icon: Code2,
    title: "Developer",
    blurb: "terminal first — poke the internals",
    tilt: 1.5,
  },
  {
    id: "visitor",
    icon: Compass,
    title: "Just visiting",
    blurb: "the full dashboard, no agenda",
    tilt: -1,
  },
];

export function Gate({ onPick }: { onPick: (mode: Mode) => void }) {
  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.4 } }}
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-10 bg-background px-6"
    >
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-faint"
        >
          ❖ ShivOS · first-run setup
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="mt-4 text-4xl font-medium tracking-tighter text-foreground md:text-6xl"
        >
          Before I show you around —
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
          className="mt-3 text-lg font-light text-muted md:text-xl"
        >
          who am I talking to?
        </motion.p>
      </div>

      <div className="flex w-full max-w-3xl flex-col gap-4 md:flex-row">
        {options.map((option, i) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 24, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: option.tilt }}
            whileHover={{
              rotate: 0,
              y: -8,
              scale: 1.03,
              transition: { type: "spring", stiffness: 300, damping: 16 },
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.35 + i * 0.1 }}
            onClick={() => onPick(option.id)}
            className="group flex flex-1 flex-col items-start gap-3 rounded-2xl border border-line bg-surface p-6 text-left shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-colors duration-300 hover:border-foreground/25 dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
          >
            <option.icon
              className="h-6 w-6 text-muted transition-colors duration-300 group-hover:text-accent"
              strokeWidth={1.5}
            />
            <span className="text-xl font-medium tracking-tight text-foreground">
              {option.title}
            </span>
            <span className="text-[13px] font-light leading-relaxed text-muted">
              {option.blurb}
            </span>
          </motion.button>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, rotate: -2 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="handwritten text-lg text-faint"
      >
        no wrong answers — you can switch anytime from the top bar
      </motion.p>
    </motion.div>
  );
}
