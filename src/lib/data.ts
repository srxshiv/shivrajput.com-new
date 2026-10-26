export const site = {
  name: "Shiv Rajput",
  role: "Full-stack Engineer",
  tagline: "Computer science enthusiast — doing full-stack development right now.",
  email: "srxshiv@gmail.com",
  location: "Dehradun, India",
  /* where the work happens from — shown in contact, skills.json, terminal */
  workMode: "Remote",
  timezone: "IST (UTC+5:30)",
  headline: "I build production systems end to end.",
  intro:
    "Full-stack engineer working across the whole surface of a product — system design, API architecture, cloud infrastructure, and interfaces that feel considered. Currently engineering healthcare software at MedikZo, remotely from Dehradun.",
  /* the fullstack resume (22 Oct 2026, founding-engineer edition), served from /public */
  resume: "/Shiv-Rajput-Resume.pdf",
};

/* the cover letter — one message: I learn what the work needs, take
   ownership, and deliver. Detail lives in Dobby's knowledge base (/admin).
   `**x**` is written in heavier ink. */
export const letter = {
  greeting: "Hi there,",
  paragraphs: [
    "I'm Shiv, a software engineer. I don't pick problems by stack: whatever the product needs, I learn it, build it and ship it.",
    "In January 2026, while still finishing my degree, I joined MedikZo, an early-stage doctor-booking startup, as **one of its founding engineers**. Through launch, the whole engineering team was **two people**. There was no product to maintain. We **built the platform from scratch** and took it all the way to launch. Today it serves **4,000+ users**, and a 10-agent call center spends its working day in the agent console I led.",
    "I didn't stay in one lane. That console has handled **2,400+ requests**, and agents now place **55% of all bookings** through it. I wrote the analytics layer in plain SQL, the call-recording pipeline on AWS, and the recovery sweeps that re-dispatch stranded bookings within two minutes. When production broke, I traced it from live data and fixed the cause, not the symptom.",
    "Much of that was new to me when the week started: telephony webhooks, CloudFormation and IAM, SQL percentiles, signing iOS builds for the App Store. I **learned each one because the product needed it, then shipped it**. It's what I trust most about myself: put me in front of an unfamiliar stack and I become useful in it fast. I keep the habit on purpose, and my side projects run on Rust and Tauri, Vapi voice agents and GraphQL.",
    "So that's what I bring. I **learn what the job needs**, I **take ownership**, and I **deliver**. If your team has hard problems and cares about solving them well, I'd love to talk.",
  ],
  signoff: "Best,",
  signature: "Shiv Rajput",
  postscript: {
    lead: "P.S. the ten-second version:",
    items: [
      "one of two engineers who built a startup's platform from zero to launch",
      "ships across the stack: React, NestJS, PostgreSQL, AWS",
      "learns whatever the work needs, fast",
      "fixes production from real data, not guesses",
    ],
  },
};

export const socials = [
  { label: "GitHub", href: "https://github.com/srxshiv" },
  { label: "LinkedIn", href: "https://linkedin.com/in/srxshiv" },
  { label: "Twitter", href: "https://twitter.com/srxshiv" },
  { label: "Instagram", href: "https://instagram.com/srxshiv" },
];

export const craft = [
  {
    tag: "01",
    title: "Product engineering",
    description:
      "Whole features, end to end — schema, API, UI. I care about the seams: shared types across the stack, contracts that break loudly in CI instead of quietly in production.",
    points: ["Next.js / React frontends", "NestJS & Node APIs", "End-to-end type safety with Zod"],
  },
  {
    tag: "02",
    title: "Systems & infrastructure",
    description:
      "The parts users never see but always feel. Queues, locks, and serverless architecture designed for correctness first — then tuned until the bill drops.",
    points: ["AWS — Fargate, Lambda, SQS", "PostgreSQL, row-level locking", "IaC, CI/CD with GitHub Actions"],
  },
  {
    tag: "03",
    title: "Interfaces that feel right",
    description:
      "Fast, considered UI — motion used for clarity, not decoration. If an interaction doesn't help someone understand the product, it doesn't ship.",
    points: ["Design systems in Tailwind", "Motion with intent", "Real-time UX — SSE, WebSockets"],
  },
];

export type ProjectLevel = "advanced" | "intermediate" | "beginner";

export type Project = {
  index: string;
  level: ProjectLevel;
  title: string;
  year: string;
  summary: string;
  detail: string;
  stack: string[];
  image: string;
  live?: string;
  github?: string;
};

export const projects: Project[] = [
  {
    index: "01",
    title: "DevsOwl",
    level: "advanced",
    year: "2026",
    summary: "Developer footprint aggregator",
    detail:
      "Pulls GitHub, LeetCode and open-source activity into one shareable profile — parallel GraphQL fan-out normalized into a typed PostgreSQL schema, rendered with SSR and request-level caching. 50+ active users on day one.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "GraphQL", "Prisma"],
    image:
      "https://res.cloudinary.com/ddyehcaeo/image/upload/v1771333552/z8hginpogt2glymf9sle.png",
    live: "https://devsowl.com/",
    github: "https://github.com/SSharma1103/devora",
  },
  {
    index: "02",
    title: "Heyllo.ai",
    level: "intermediate",
    year: "2025",
    summary: "Real-time AI voice interviews",
    detail:
      "Live voice agents over a Deepgram → GPT-4 → ElevenLabs pipeline, driven by an event-based state machine. Two-stage Gemini flow with Zod-structured output scores transcripts across five rubric categories.",
    stack: ["Next.js 15", "React 19", "Vapi", "Gemini", "Firebase"],
    image:
      "https://res.cloudinary.com/ddyehcaeo/image/upload/v1753271374/Screenshot_2025-07-23_at_5.19.20_PM_gkuvmm.png",
    live: "https://heylloai.vercel.app",
    github: "https://github.com/srxshiv/heyllo.ai",
  },
  {
    index: "03",
    title: "Wispr Flow",
    level: "intermediate",
    year: "2025",
    summary: "Native voice-to-text for desktop",
    detail:
      "Desktop-native dictation bridging a React frontend with a Rust backend through Tauri — system-level keystroke injection, OS accessibility permissions, and low-latency audio capture.",
    stack: ["Tauri", "Rust", "React", "TypeScript"],
    image:
      "https://res.cloudinary.com/ddyehcaeo/image/upload/v1766927655/Screenshot_2025-12-28_at_6.43.16_PM_ydntxb.png",
    github: "https://github.com/srxshiv/wispr_flow_tauri.git",
  },
  {
    index: "04",
    title: "Uniwizz",
    level: "intermediate",
    year: "2024",
    summary: "Campus marketplace",
    detail:
      "College-exclusive marketplace with official university email verification and real-time WebSocket chat for buying, selling, and freelance services.",
    stack: ["React", "MongoDB", "Express", "WebSocket"],
    image:
      "https://res.cloudinary.com/ddyehcaeo/image/upload/v1753271528/IMG_0490_md8el5.jpg",
    live: "https://www.uniwizz.in",
    github: "https://github.com/srxshiv/UniWizz-frontend",
  },
  {
    index: "05",
    title: "Broke No More",
    level: "beginner",
    year: "2024",
    summary: "Personal finance visualizer",
    detail:
      "Tracks spending through clear charts — budgets, transaction categorization, and financial insights without the noise.",
    stack: ["Next.js", "MongoDB", "Tailwind"],
    image:
      "https://res.cloudinary.com/ddyehcaeo/image/upload/v1753394494/Screenshot_2025-07-25_at_3.20.32_AM_l33ytb.png",
    live: "https://broke-no-more-seven.vercel.app",
    github: "https://github.com/srxshiv/BrokeNoMore.git",
  },
];

/* every MedikZo claim here follows the resumes (22 Oct 2026 attribution
   edition) and ~/Downloads/resume/MEDIKZO_BULLET_LIBRARY.md. Platform-wide
   work by colleagues (monorepo, API as a whole, assignment engine, ECS/CI/CD
   platform, DigitalOcean move) is never claimed. `**x**` renders bold. */
export const experience = {
  company: "MedikZo",
  role: "Full-stack Engineer",
  period: "Jan 2026 — Present",
  location: "Remote · Dehradun, India",
  product: "early-stage doctor-booking startup",
  /* how the role happened — off-campus, not through placement */
  via: "LinkedIn · off-campus",
  blurb:
    "One of the founding engineers — a 2-person engineering team through launch. Full-stack across the React frontend, the NestJS / PostgreSQL backend and the AWS Lambda workers of a doctor-booking platform now serving 4,000+ users and a 10-agent call center.",
  impact: [
    { value: "2,400+", label: "requests through the agent console I led" },
    { value: "55%", label: "of all bookings placed through my book-on-behalf flow" },
    { value: "24 → 10 min", label: "median time-to-confirm, as volume grew 3.6×" },
    { value: "26K+", label: "calls worked in the telephony workspace" },
    { value: "3,800", label: "lines of analytics SQL behind 31 charts" },
    { value: "69% → 24%", label: "false agent time-outs, fixed from production data" },
  ],
  areas: [
    {
      title: "Product & workflows",
      summary: "the booking flow a 10-agent call center runs on",
      points: [
        "**Led the agent console** from its first working version: an SLA-sorted React queue board, appointment desk and book-on-behalf flow behind **2,400+ requests**; median time-to-confirm fell **24 → 10 min** and SLA breaches **44% → 9.8%** as volume grew **3.6×**.",
        "Delivered the directory and **book-on-behalf** flow (patient lookup or creation, soonest-clinic pool, slot rules, duplicate warnings) through which agents place **55% of all bookings** and have created **1,095 user accounts**.",
        "Developed the appointment state machine's **handovers** (one pending offer per case, enforced by a partial unique index), **409** terminal-state guards and structured post-visit feedback (**626 records**).",
        "Reworked the **SLA clock** so it runs only while an agent owns a case, with a per-agent park bank shared by the API and three Lambda workers.",
      ],
      stack: ["React", "TanStack Query", "NestJS", "PostgreSQL"],
    },
    {
      title: "Frontend",
      summary: "four consoles, one shared UI package",
      points: [
        "Wrote the largest share of the four role-locked **React** consoles; engineered the agents' queue board: an SLA-sorted kanban with ref-driven countdowns (**zero re-renders per tick**), **TanStack Query** write-through caching and **optimistic mutations** with rollback.",
        "**Architected the shared UI package** for all four consoles (dependency-injected data hooks, render slots), removing **33K duplicated lines**; built the token-based light/dark theme on CSS variables.",
        "Developed the in-browser **telephony workspace**: dialpad, draggable live-call panel, per-caller threads and authenticated recording playback, used across **26K+ calls** and **250+ hours** of talk time.",
        "Created the **admin console**: **31 charts** with URL-shareable filters and lazy routes, a per-agent scorecard of hand-rolled **SVG** charts, and the catalog tool used to onboard **726 doctors** and **259 facilities**.",
      ],
      stack: ["React", "TanStack Query", "Tailwind CSS", "Ant Design", "dnd-kit", "SVG charts"],
    },
    {
      title: "Backend & data",
      summary: "SQL that answers questions, constraints that keep data honest",
      points: [
        "**Architected the analytics API**: five services of hand-written **PostgreSQL** (**3,800 lines**: cohorts, percentiles, SLA and conversion metrics, IST bucketing over half-open UTC ranges), self-scoped per agent and served by **25 purpose-built indexes**.",
        "Developed **webhook telephony**: traced a CHECK-constraint violation in production and replaced the lead model with per-caller SQL threads, across **26K+ calls** and **160K+ webhook events** (peak **23K a day**).",
        "Wrote **80+ migrations** (partial unique indexes, CHECK constraints, an immutable phonetic-search SQL function) and fixed an ORM bug that silently discarded foreign-key updates, with a repair migration.",
        "Built a two-way **n8n** / ClickUp sync with signed webhooks, loop guards and idempotent upserts; extended the **JWT / CASL** model with ownership checks and self-scoped analytics.",
      ],
      stack: ["NestJS", "PostgreSQL", "TypeORM", "CASL", "n8n", "Webhooks"],
    },
    {
      title: "Cloud & delivery",
      summary: "the infrastructure behind every feature I shipped",
      points: [
        "Developed the workflow logic in **AWS Lambda** workers: recovery sweeps that re-dispatch stranded bookings **within 2 minutes**, **EventBridge**-scheduled jobs, assignment rules and an **SQS FIFO** deduplication fix.",
        "Built a private call-recording pipeline: bounded downloads, a TLS-only encrypted **S3** bucket in **CloudFormation** with least-privilege **IAM**, and a JWT / CASL-guarded streaming endpoint, with **24K+ recordings** mirrored (**97.8%**).",
        "Stood up the admin console's **S3 + CloudFront** hosting (OAC, SPA routing) in CloudFormation with a **GitHub Actions** OIDC pipeline (build, S3 sync, CDN invalidation); renamed a live console's hostname with **zero downtime**.",
        "Wired secrets through **SSM Parameter Store** into ECS with fail-fast boot validation; promoted **13 releases** via dev → main auto-deploys on **ECS Fargate**, then DigitalOcean after the platform's migration; shipped **7 iOS builds**.",
      ],
      stack: ["AWS Lambda", "EventBridge", "SQS", "S3", "CloudFront", "CloudFormation", "GitHub Actions"],
    },
    {
      title: "Reliability",
      summary: "measure first, then fix the real cause",
      points: [
        "Diagnosed production-only 500s with pg_stat_activity as **connection-pool exhaustion** (one page load pinning **10/10** connections) and fixed them with bounded concurrency and abortable requests.",
        "Used 30 days of production data to find false agent time-outs (mobile browsers suspending timers): time-out session ends fell **69% → 24%**, average session **82 → 199 min**.",
        "Unified three diverging definitions of a missed call into one SQL predicate, and fixed a sweep that turned answered calls into phantom misses.",
        "Added **367 tests** with the first shared integration-test harness, and a regression test with every production fix.",
      ],
      stack: ["PostgreSQL", "Node.js", "Jest", "Supertest"],
    },
  ],
  /* the draggable receipt — my own counts, itemised */
  receipt: [
    ["Engineers through launch", "2"],
    ["Requests via my console", "2,400+"],
    ["Bookings placed by agents", "55%"],
    ["Calls worked", "26K+"],
    ["Webhook events", "160K+"],
    ["Recordings mirrored", "24K+"],
    ["Analytics SQL", "3,800 lines"],
    ["Charts", "31"],
    ["Migrations", "80+"],
    ["Tests (+ first harness)", "367"],
    ["Duplicate lines cut", "33K"],
    ["Releases promoted", "13"],
  ],
  receiptTotal: ["users now served", "4,000+"],
};

export const stack = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Rust", "SQL", "Python", "C/C++"] },
  { group: "Frameworks", items: ["Next.js", "React", "NestJS", "Node.js", "Tauri", "TailwindCSS"] },
  { group: "Cloud", items: ["AWS", "ECS Fargate", "Lambda", "SQS", "Docker", "CI/CD", "Vercel"] },
  { group: "Data", items: ["PostgreSQL", "Prisma", "TypeORM", "GraphQL", "MongoDB", "Firebase"] },
];

export const marquee = [
  "TypeScript",
  "Next.js",
  "NestJS",
  "PostgreSQL",
  "AWS",
  "Rust",
  "GraphQL",
  "Docker",
  "React",
  "Tauri",
];
