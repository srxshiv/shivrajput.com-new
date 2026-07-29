"use client";

import { motion } from "framer-motion";
import { experience } from "@/lib/data";

const EASE = [0.25, 1, 0.5, 1] as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/* the medikzo story, told as a commit history */
const commits: {
  hash: string;
  tag?: string;
  message: string;
  body: string;
}[] = [
  {
    hash: "a3f9c21",
    tag: "HEAD → prod",
    message: "perf: cut compute costs 60%",
    body: "moved async workloads to Lambda, ran the API on Fargate Spot behind an ALB — CloudFormation all the way down, deployed via GitHub Actions OIDC.",
  },
  {
    hash: "8d2e110",
    message: "feat: SLA-driven assignment engine",
    body: "AWS Lambda + SQS FIFO routes every lead within 30 min. Pessimistic SKIP LOCKED row locks — zero duplicate assignments, 100% lead capture.",
  },
  {
    hash: "5b7fe93",
    message: "feat: real-time appointment tracking",
    body: "Server-Sent Events over 229+ NestJS endpoints, webhook-driven telephony, Algolia fuzzy search — CASL authorization across 5 roles.",
  },
  {
    hash: "1c04ab7",
    message: "init: turborepo monorepo",
    body: "one NestJS API, three React frontends, one shared Zod schema — contract breaks fail in CI, not in production.",
  },
];

export function ExperienceContent() {
  return (
    <div className="grid grid-cols-1 items-start gap-10 p-6 lg:grid-cols-[1.3fr_1fr]">
      {/* ── left: git log ────────────────────────── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-col"
      >
        <motion.div variants={fadeUp}>
          <h2 className="text-3xl font-medium tracking-tighter text-foreground">
            Meanwhile, at{" "}
            <span className="whitespace-nowrap">
              Medikzo<span className="text-accent">.</span>
            </span>
          </h2>
          <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-muted">
            {experience.blurb}
          </p>
          <p className="mt-6 font-mono text-[12px] text-faint">
            <span className="text-accent">➜</span> ~/medikzo{" "}
            <span className="text-accent">git log</span> --story
          </p>
        </motion.div>

        {/* commit graph */}
        <div className="mt-6 flex flex-col">
          {commits.map((commit, i) => (
            <motion.div
              key={commit.hash}
              variants={fadeUp}
              whileHover={{ x: 6 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="group relative flex gap-5 pb-8 last:pb-0"
            >
              {/* graph line + node */}
              <div className="relative flex w-4 shrink-0 justify-center">
                {i < commits.length - 1 && (
                  <span className="absolute top-3 h-full w-px bg-line" />
                )}
                <span className="relative z-10 mt-1.5 h-3 w-3 rounded-full border-2 border-accent bg-background transition-colors duration-300 group-hover:bg-accent" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[12px]">
                  <span className="text-faint">{commit.hash}</span>
                  {commit.tag && (
                    <span className="rounded-full border border-accent/40 px-2 py-0.5 text-[10px] text-accent">
                      {commit.tag}
                    </span>
                  )}
                </div>
                <h4 className="mt-1.5 font-mono text-[15px] font-medium tracking-tight text-foreground md:text-base">
                  {commit.message}
                </h4>
                <p className="mt-2 max-w-lg text-sm font-light leading-relaxed text-muted">
                  {commit.body}
                </p>
              </div>
            </motion.div>
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

          <div className="dashed-row my-4" />

          {[
            ["API endpoints", "229+"],
            ["TypeORM entities", "35+"],
            ["React frontends", "×3"],
            ["Roles secured (CASL)", "×5"],
            ["Lead capture", "100%"],
            ["App downloads", "1,000+"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-1">
              <span className="text-muted">{label}</span>
              <span className="text-foreground">{value}</span>
            </div>
          ))}

          <div className="dashed-row my-4" />

          <div className="flex justify-between text-foreground">
            <span className="font-semibold">TOTAL · compute bill</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              −60%
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
      </motion.div>
    </div>
  );
}
