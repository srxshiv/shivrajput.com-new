"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/data";

const EASE = [0.25, 1, 0.5, 1] as const;

type Skill = { name: string; value: string; note?: string };
type Group = { key: string; skills: Skill[] };

/* top-level fields — who, where, what */
const meta: [string, string][] = [
  ["name", "shiv-rajput"],
  ["role", "full-stack engineer"],
  ["based_in", `${site.location.toLowerCase()} · ${site.workMode.toLowerCase()}`],
  ["currently", "medikzo · jan 2026 → present"],
];

/* skills as config — the comments are the receipts */
const groups: Group[] = [
  {
    key: "languages",
    skills: [
      { name: "typescript", value: "daily driver", note: "everything I ship is typed, end to end" },
      { name: "javascript", value: "fluent" },
      { name: "sql", value: "production", note: "locks, indexes, raw-SQL analytics" },
      { name: "python", value: "comfortable" },
      { name: "c/c++", value: "comfortable" },
      { name: "rust", value: "learning fast", note: "built Wispr Flow's native layer with it" },
      { name: "bash", value: "scripting" },
    ],
  },
  {
    key: "frontend",
    skills: [
      { name: "react", value: "19", note: "four role-locked consoles at MedikZo" },
      { name: "next.js", value: "15", note: "SSR + caching — DevsOwl, Heyllo.ai, this site" },
      { name: "tanstack-query", value: "production", note: "optimistic mutations with rollback" },
      { name: "tailwind-css", value: "daily" },
      { name: "ant-design", value: "production" },
      { name: "dnd-kit", value: "drag & drop", note: "catalog ordering for 726 doctors" },
      { name: "svg-charts", value: "hand-rolled", note: "the agent scorecard, no chart lib" },
      { name: "vite", value: "build" },
    ],
  },
  {
    key: "backend",
    skills: [
      { name: "node.js", value: "lts" },
      { name: "nestjs", value: "540+ endpoints", note: "the MedikZo API runs on it" },
      { name: "express", value: "comfortable" },
      { name: "graphql", value: "fan-out", note: "parallel queries for DevsOwl" },
      { name: "typeorm", value: "120+ entities" },
      { name: "prisma", value: "typed", note: "this site's backend" },
      { name: "zod", value: "one contract", note: "shared by the API, 4 consoles, 12 Lambdas" },
      { name: "casl", value: "5 roles", note: "role-based access, city-scoped data" },
      { name: "webhooks", value: "160K+ events", note: "idempotent telephony ingestion" },
      { name: "auth", value: "otp + jwt", note: "layered rate limits under advisory locks" },
    ],
  },
  {
    key: "databases",
    skills: [
      { name: "postgresql", value: "row + advisory locks", note: "240+ migrations, 180+ indexes" },
      { name: "typesense", value: "self-hosted", note: "migrated off Algolia" },
      { name: "firebase", value: "auth + firestore" },
      { name: "mongodb", value: "comfortable" },
    ],
  },
  {
    key: "cloud",
    skills: [
      { name: "aws-lambda", value: "12 workers", note: "the call-center assignment engine" },
      { name: "aws-ecs-fargate", value: "spot · 3 AZs", note: "behind an ALB, circuit-breaker rollback" },
      { name: "aws-s3-cloudfront", value: "4 web apps", note: "+ 24K call recordings, private" },
      { name: "aws-sqs-eventbridge", value: "queues + schedules", note: "dead-letter queues on the workers" },
      { name: "aws-iam", value: "least privilege", note: "GitHub OIDC — no long-lived keys" },
      { name: "digitalocean", value: "production", note: "moved here with zero data loss" },
    ],
  },
  {
    key: "devops",
    skills: [
      { name: "docker", value: "compose in prod" },
      { name: "cloudformation", value: "24 templates", note: "every AWS resource as code" },
      { name: "github-actions", value: "17 workflows", note: "OIDC, health-gated deploys" },
      { name: "caddy", value: "reverse proxy + tls" },
      { name: "vector", value: "structured logs", note: "correlation IDs end to end" },
      { name: "vercel", value: "side projects" },
      { name: "linux", value: "daily" },
    ],
  },
  {
    key: "testing",
    skills: [
      { name: "jest", value: "3,900+ tests", note: "unit + database-backed integration" },
      { name: "supertest", value: "api" },
      { name: "vitest", value: "frontend" },
      { name: "testing-library", value: "react" },
    ],
  },
  {
    key: "tools",
    skills: [
      { name: "git", value: "daily" },
      { name: "n8n", value: "workflow automation" },
    ],
  },
];

type Row = { key: string; hover?: boolean; node: React.ReactNode };

const str = (text: string) => (
  <span className="text-emerald-600 dark:text-emerald-400">&quot;{text}&quot;</span>
);
const open = (key: string) => (
  <span className="pl-4">
    <span className="text-accent">&quot;{key}&quot;</span>
    <span className="text-muted">: {"{"}</span>
  </span>
);
const close = (text: string) => <span className="pl-4 text-muted">{text}</span>;

/* the file, line by line — static, so it's built once and numbered by index */
const rows: Row[] = [
  { key: "open", node: <span className="text-muted">{"{"}</span> },
  ...meta.map(([key, value]) => ({
    key: `meta-${key}`,
    node: (
      <span className="pl-4">
        <span className="text-accent">&quot;{key}&quot;</span>
        <span className="text-muted">: </span>
        {str(value)}
        <span className="text-muted">,</span>
      </span>
    ),
  })),
  ...groups.flatMap((group) => [
    { key: `${group.key}-open`, node: open(group.key) },
    ...group.skills.map((skill) => ({
      key: `${group.key}-${skill.name}`,
      hover: true,
      node: (
        <>
          {/* fixed code column so every comment starts at the same place */}
          <span className="shrink-0 whitespace-nowrap pl-8 @3xl:min-w-[48ch]">
            <span className="text-foreground/80">&quot;{skill.name}&quot;</span>
            <span className="text-muted">: </span>
            {str(skill.value)}
            <span className="text-muted">,</span>
          </span>
          {skill.note && (
            <span className="hidden whitespace-nowrap pl-4 text-faint @3xl:inline">
              {"// "}
              {skill.note}
            </span>
          )}
        </>
      ),
    })),
    { key: `${group.key}-close`, node: close("},") },
  ]),
  { key: "contact-open", node: open("contact") },
  {
    key: "contact-hire",
    hover: true,
    node: (
      <span className="pl-8">
        <span className="text-foreground/80">&quot;hire&quot;</span>
        <span className="text-muted">: </span>
        <a
          href={`mailto:${site.email}`}
          className="text-emerald-600 underline decoration-dotted underline-offset-4 transition-colors hover:text-accent dark:text-emerald-400"
        >
          &quot;mailto:{site.email}&quot;
        </a>
      </span>
    ),
  },
  { key: "contact-close", node: close("}") },
  { key: "close", node: <span className="text-muted">{"}"}</span> },
];

export function SkillsContent() {
  return (
    <div className="@container">
      {/* file meta strip */}
      <div className="flex items-center justify-between border-b border-line bg-surface px-5 py-2">
        <p className="handwritten rotate-[-1deg] text-base">
          the comments are the receipts
        </p>
        <span className="font-mono text-[10px] text-faint/60">
          {rows.length} lines · utf-8 · json
        </span>
      </div>

      {/* code */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
        className="no-scrollbar overflow-x-auto p-5 font-mono text-[12.5px] leading-[1.9]"
      >
        {rows.map((row, i) => (
          <div
            key={row.key}
            className={`flex ${
              row.hover
                ? "rounded transition-colors duration-200 hover:bg-panel-hover"
                : ""
            }`}
          >
            <span className="w-8 shrink-0 select-none pr-4 text-right text-faint/60">
              {i + 1}
            </span>
            {row.node}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
