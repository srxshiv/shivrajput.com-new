"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.25, 1, 0.5, 1] as const;

type Dep = { name: string; version: string; note?: string };
type Group = { key: string; deps: Dep[] };

/* skills as dependencies — versions tell the story */
const groups: Group[] = [
  {
    key: "languages",
    deps: [
      { name: "typescript", version: "^daily-driver", note: "everything I ship is typed" },
      { name: "javascript", version: "^fluent" },
      { name: "rust", version: "~learning-fast", note: "built Wispr Flow's native layer with it" },
      { name: "sql", version: "^production", note: "SKIP LOCKED is a personality trait" },
      { name: "python", version: "^comfortable" },
    ],
  },
  {
    key: "frameworks",
    deps: [
      { name: "next.js", version: "^15.0.0", note: "SSR, server actions, the works" },
      { name: "react", version: "^19.0.0" },
      { name: "nestjs", version: "^229-endpoints", note: "the Medikzo API runs on it" },
      { name: "node.js", version: "^lts" },
      { name: "tauri", version: "^desktop", note: "React front, Rust back" },
      { name: "tailwindcss", version: "^this-site" },
    ],
  },
  {
    key: "cloud",
    deps: [
      { name: "aws-fargate", version: "^spot-instances", note: "60% cheaper than before I touched it" },
      { name: "aws-lambda", version: "^serverless" },
      { name: "sqs-fifo", version: "^exactly-once", note: "SLA routing under 30 min" },
      { name: "docker", version: "^everywhere" },
      { name: "github-actions", version: "^oidc", note: "no long-lived AWS keys" },
    ],
  },
  {
    key: "data",
    deps: [
      { name: "postgresql", version: "^row-locks", note: "35+ entities at Medikzo" },
      { name: "prisma", version: "^typed" },
      { name: "typeorm", version: "^production" },
      { name: "graphql", version: "^fan-out", note: "parallel queries for DevsOwl" },
      { name: "mongodb", version: "^flexible" },
      { name: "firebase", version: "^auth+firestore" },
    ],
  },
];

const totalLines =
  2 + groups.reduce((n, g) => n + g.deps.length + 2, 0) + 4;

export function SkillsContent() {
  const [hovered, setHovered] = useState<string | null>(null);
  let line = 0;
  const nextLine = () => {
    line += 1;
    return line;
  };

  const LineNo = ({ n }: { n: number }) => (
    <span className="w-8 shrink-0 select-none pr-4 text-right text-faint/60">
      {n}
    </span>
  );

  return (
    <div>
      {/* file meta strip */}
      <div className="flex items-center justify-between border-b border-line bg-surface px-5 py-2">
        <p className="handwritten rotate-[-1deg] text-base">
          hover the deps for footnotes
        </p>
        <span className="font-mono text-[10px] text-faint/60">
          {totalLines} lines · utf-8 · json
        </span>
      </div>

      {/* code */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
        className="no-scrollbar overflow-x-auto p-5 font-mono text-[12.5px] leading-[1.9]"
      >
          <div className="flex">
            <LineNo n={nextLine()} />
            <span className="text-muted">{"{"}</span>
          </div>
          <div className="flex">
            <LineNo n={nextLine()} />
            <span className="pl-4">
              <span className="text-accent">&quot;name&quot;</span>
              <span className="text-muted">: </span>
              <span className="text-emerald-600 dark:text-emerald-400">
                &quot;shiv-rajput&quot;
              </span>
              <span className="text-muted">,</span>
            </span>
          </div>

          {groups.map((group, gi) => (
            <div key={group.key}>
              <div className="flex">
                <LineNo n={nextLine()} />
                <span className="pl-4">
                  <span className="text-accent">&quot;{group.key}&quot;</span>
                  <span className="text-muted">: {"{"}</span>
                </span>
              </div>
              {group.deps.map((dep) => {
                const id = `${group.key}-${dep.name}`;
                return (
                  <div
                    key={id}
                    className="relative flex rounded transition-colors duration-200 hover:bg-panel-hover"
                    onMouseEnter={() => setHovered(id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <LineNo n={nextLine()} />
                    <span className="pl-8">
                      <span className="text-foreground/80">
                        &quot;{dep.name}&quot;
                      </span>
                      <span className="text-muted">: </span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        &quot;{dep.version}&quot;
                      </span>
                      <span className="text-muted">,</span>
                    </span>
                    <AnimatePresence>
                      {dep.note && hovered === id && (
                        <motion.span
                          initial={{ opacity: 0, x: -6, rotate: 0 }}
                          animate={{ opacity: 1, x: 0, rotate: -1.5 }}
                          exit={{ opacity: 0, x: -4 }}
                          transition={{ duration: 0.25, ease: EASE }}
                          className="handwritten pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 whitespace-nowrap text-base text-muted lg:block"
                        >
                          ← {dep.note}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              <div className="flex">
                <LineNo n={nextLine()} />
                <span className="pl-4 text-muted">
                  {"}"}
                  {gi < groups.length - 1 ? "," : ","}
                </span>
              </div>
            </div>
          ))}

          <div className="flex">
            <LineNo n={nextLine()} />
            <span className="pl-4">
              <span className="text-accent">&quot;scripts&quot;</span>
              <span className="text-muted">: {"{"}</span>
            </span>
          </div>
          <div className="flex rounded transition-colors duration-200 hover:bg-panel-hover">
            <LineNo n={nextLine()} />
            <span className="pl-8">
              <span className="text-foreground/80">&quot;hire&quot;</span>
              <span className="text-muted">: </span>
              <a
                href="mailto:srxshiv@gmail.com"
                className="text-emerald-600 underline decoration-dotted underline-offset-4 transition-colors hover:text-accent dark:text-emerald-400"
              >
                &quot;mailto:srxshiv@gmail.com&quot;
              </a>
            </span>
          </div>
          <div className="flex">
            <LineNo n={nextLine()} />
            <span className="pl-4 text-muted">{"}"}</span>
          </div>
          <div className="flex">
            <LineNo n={nextLine()} />
            <span className="text-muted">{"}"}</span>
          </div>
      </motion.div>
    </div>
  );
}
