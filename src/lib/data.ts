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
  resume:
    "https://drive.google.com/file/d/1npWtPejEb8ZEzngtwm40Cd4UToSDgE7o/view?usp=share_link",
};

/* the cover letter */
export const letter = {
  greeting: "Hi there,",
  paragraphs: [
    "I am Shiv, a computer science enthusiast and full stack developer. I work across the entire surface of a product- relational data modelling, API architecture, cloud infrastructure, and interfaces that are actually enjoyable to use(like this one :) ). My journey into software engineering started because I find complex systems endlessly fascinating: concurrency guarantees, message queues, the failure modes that only surface under real load. But I stayed because the thrill of actually shipping them to real users is unmatched.",
    "Currently, I build the web platform behind MedikZo, an assisted doctor-booking service with a 10-agent call center and 4,000+ registered users across 20 towns. I architected it as a Turborepo monorepo: a NestJS and PostgreSQL API with 540+ REST endpoints, four role-specific React consoles and 12 AWS Lambda workers, all on shared Zod schemas so a contract break fails the build. The assisted-booking workflow I shipped has processed 2,400+ appointment requests, and median time-to-confirm fell from 24 to 10 minutes while monthly volume grew 3.6x.",
    "Beyond the code, I own the infrastructure and delivery: AWS defined in CloudFormation, GitHub Actions CI/CD with OIDC, and our Dockerized API on ECS Fargate behind an ALB, followed by a zero-data-loss migration of production to Docker on DigitalOcean. I improve performance by measurement: a single-flight cache took a hot endpoint from 538 to 4,388 req/s, and bounding query concurrency fixed production errors caused by connection-pool exhaustion. Leaving easy wins on the table simply bothers me.",
    "On the side, I build whatever challenges me to learn something completely new. Recently, I independently launched DevsOwl, a developer footprint aggregator, and Heyllo.ai, a real time AI voice interview platform. I intentionally choose different tech stacks for my projects — spanning Next.js, Rust, and Vapi — because I believe technical breadth compounds your overall engineering intuition.",
    "While I am incredibly confident in my ability to build and scale robust applications, I am always aware of how much there is left to explore. If I encounter a framework, cloud service, or language I do not know, I have absolute certainty that I can dive in and master it quickly. I am deeply hungry to grow and ready to adapt to whatever the codebase requires.",
    "I am looking for hard problems and an engineering team that deeply cares about the craft. If that sounds like your culture, my inbox is genuinely open.",
  ],
  signoff: "Best regards,",
  signature: "Shiv Rajput",
  checklist: [
    "ships production systems, not demos",
    "owns infra — AWS, IaC, CI/CD",
    "types everything, end to end",
    "learns fast (Rust, most recently)",
    "actually replies to email",
    "A very kind and generous person"
  ],
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

/* every MedikZo number here matches the resumes (fullstack, frontend,
   backend, devops, swe) — figures verified against the repo and production.
   Don't add one that isn't. `**x**` renders bold in the Experience app. */
export const experience = {
  company: "MedikZo",
  role: "Full-stack Engineer",
  period: "Jan 2026 — Present",
  location: "Remote · Dehradun, India",
  product: "assisted doctor-booking & call-center platform",
  /* how the role happened — off-campus, not through placement */
  via: "LinkedIn · off-campus",
  blurb:
    "Built the web platform behind MedikZo end to end — the API, four internal consoles, background workers and cloud infrastructure — for an assisted doctor-booking service with a 10-agent call center, 4,000+ registered users and 726 doctors across 20 towns.",
  impact: [
    { value: "4,000+", label: "registered users on the platform" },
    { value: "24 → 10 min", label: "median time-to-confirm, as volume grew 3.6×" },
    { value: "540+", label: "REST endpoints behind one typed contract" },
    { value: "26K+", label: "calls through the telephony stack" },
    { value: "538 → 4,388", label: "req/s on a hot endpoint after caching" },
    { value: "Zero", label: "data lost moving production off AWS" },
  ],
  areas: [
    {
      title: "Product & architecture",
      summary: "one monorepo, four consoles, one contract",
      points: [
        "Architected a **Turborepo** monorepo: a NestJS API with **540+ REST endpoints**, four role-specific React consoles and **12 AWS Lambda workers**, typed end to end with shared **Zod** schemas so a contract break fails the build.",
        "Shipped the assisted-booking workflow from UI to database — an SLA-sorted queue board and appointment desk over a PostgreSQL state machine that processed **2,400+ requests** as **median time-to-confirm fell from 24 to 10 minutes** while volume grew **3.6×**.",
        "Extracted a shared UI package across the four consoles that removed **36K lines of duplicated code**.",
      ],
      stack: ["TypeScript", "Turborepo", "NestJS", "React 19", "PostgreSQL", "Zod"],
    },
    {
      title: "Frontend",
      summary: "the consoles a 10-agent call center runs on",
      points: [
        "Built **four role-locked React 19 consoles** — agents, supervisors, admins, catalog team — with role-based routing and a protected-route guard per console.",
        "Engineered the agents' **live queue board**: an SLA-sorted kanban with ref-driven countdowns (no re-render per tick), **TanStack Query** write-through cache updates and **optimistic mutations** with rollback.",
        "Developed an **in-browser telephony workspace** — dialpad, draggable live-call panel, per-caller call threads, authenticated recording playback — used across **26K+ calls**.",
        "Delivered analytics dashboards with **31 charts** and URL-shareable filters, plus catalog tooling (typed filter builder, drag-and-drop ordering, image focal-point editor) used to onboard **726 doctors** and **259 facilities**.",
      ],
      stack: ["React 19", "TanStack Query", "Tailwind CSS", "Ant Design", "dnd-kit", "SVG charts"],
    },
    {
      title: "Backend & data",
      summary: "correct under concurrency, fast under load",
      points: [
        "Engineered a **concurrency-safe assignment engine** on AWS Lambda (SQS FIFO, later direct async invocation with dead-letter queues) that routes each request to the least-loaded call-center agent under SELECT FOR UPDATE row locks and per-agent **advisory locks**; recovery sweeps re-dispatch lost work **within 2 minutes**.",
        "Built **webhook-driven telephony ingestion** — append-only event log, idempotent correlation, call classification — across **160K+ events**, mirroring **24K+ recordings** to private S3 behind an authenticated streaming endpoint.",
        "Designed the data layer: **120+ TypeORM entities**, **240+ migrations** and **180+ indexes** (partial unique, expression, trigram), CHECK constraints that encode business rules, outbox tables drained with FOR UPDATE SKIP LOCKED, and an analytics API in raw SQL (cohorts, percentiles).",
        "Secured it with phone-OTP auth under layered rate limits, **JWT**, **CASL** role-based access across **5 roles** and city-scoped data isolation in SQL; migrated search from Algolia to self-hosted **Typesense**.",
      ],
      stack: ["NestJS", "PostgreSQL", "TypeORM", "AWS Lambda", "SQS", "CASL", "Typesense"],
    },
    {
      title: "Cloud & DevOps",
      summary: "infrastructure as code, deploys that check themselves",
      points: [
        "Defined the AWS infrastructure in **CloudFormation** (**24 templates**): 12 Lambdas with EventBridge schedules and DLQs, S3 + CloudFront hosting for four web apps, and least-privilege IAM with GitHub OIDC.",
        "Ran the Dockerized API on **ECS Fargate** Spot (**3 tasks across 3 AZs**) behind an ALB with rolling deploys and circuit-breaker rollback; fixed slow-start health-check failures by tuning the grace period from 60s to 180s.",
        "Built **17 GitHub Actions workflows** for the API, four web apps and 12 Lambdas — OIDC role assumption, path-filtered builds, a registry build cache and a **post-deploy health gate** that fails the run with container logs.",
        "Migrated production from ECS and RDS to Docker Compose on **DigitalOcean** with managed PostgreSQL in one planned maintenance window — frozen writes, pg_dump and parallel pg_restore, verified row counts, TLS verify-full, DNS cutover — with **zero data loss**.",
      ],
      stack: ["AWS", "CloudFormation", "ECS Fargate", "Docker", "GitHub Actions", "DigitalOcean"],
    },
    {
      title: "Reliability & performance",
      summary: "measure first, then fix the real cause",
      points: [
        "Traced intermittent production 500s to **connection-pool exhaustion** — one page load pinning **10/10 connections** — and fixed it with bounded query concurrency and abortable requests.",
        "Added a single-flight cache that took a hot endpoint from **538 to 4,388 req/s** (benchmarked).",
        "Fixed a nightly Lambda **out-of-memory crash** caused by an ORM cartesian join: per-relation queries, memory right-sized to 2 GB.",
        "Cut agent session time-outs from **69% to 24%** of sessions by choosing the liveness threshold from production data; shipped structured JSON logs with correlation IDs through Vector.",
        "Covered the API with **3,900+ unit and integration tests**, including a database-backed integration harness.",
      ],
      stack: ["PostgreSQL", "Node.js", "Jest", "Supertest", "Vector"],
    },
  ],
  /* the draggable receipt — engineering counts, itemised */
  receipt: [
    ["REST endpoints", "540+"],
    ["TypeORM entities", "120+"],
    ["Migrations", "240+"],
    ["Indexes", "180+"],
    ["React consoles", "×4"],
    ["Lambda workers", "×12"],
    ["Roles secured (CASL)", "×5"],
    ["CFN templates", "24"],
    ["CI/CD workflows", "17"],
    ["API tests", "3,900+"],
    ["Duplicate lines cut", "36K"],
  ],
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
