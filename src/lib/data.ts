export const site = {
  name: "Shiv Rajput",
  role: "Full-stack Engineer",
  tagline: "Computer science enthusiast — doing full-stack development right now.",
  email: "srxshiv@gmail.com",
  location: "India",
  headline: "I build production systems end to end.",
  intro:
    "Full-stack engineer working across the whole surface of a product — system design, API architecture, cloud infrastructure, and interfaces that feel considered. Currently engineering healthcare software at Medikzo.",
  resume:
    "https://drive.google.com/file/d/1npWtPejEb8ZEzngtwm40Cd4UToSDgE7o/view?usp=share_link",
};

/* the cover letter — greeting adapts to who's reading */
export const letter = {
  greetings: {
    recruiter: "Dear Recruiter,",
    developer: "Hey, fellow builder —",
    visitor: "Hi there,",
  },
  paragraphs: [
    "I am Shiv, a computer science enthusiast and full stack developer. I work across the entire surface of a product- relational data modelling, API architecture, cloud infrastructure, and interfaces that are actually enjoyable to use(like this one :) ). My journey into software engineering started because I find complex systems endlessly fascinating: concurrency guarantees, message queues, the failure modes that only surface under real load. But I stayed because the thrill of actually shipping them to real users is unmatched.",
    "Currently, I lead development at Medikzo, a healthcare platform with over 1,000 downloads. I oversee the entire architecture, orchestrating a robust NestJS API on PostgreSQL. I optimized our React frontends by bypassing the standard administrative doctor summary and instead populating information directly from raw properties on the frontend for immediate rendering. I unified this entire stack with a shared Zod schema to guarantee end to end type safety.",
    "Beyond the code, I manage our AWS infrastructure as code via CloudFormation. I implemented automated CI/CD pipelines using GitHub Actions with OIDC, successfully deploying our Dockerized API on an ECS Fargate cluster behind an ALB. By migrating asynchronous workloads to serverless AWS Lambda functions and leveraging Fargate Spot instances, I cut our compute bill by 60 percent. Leaving easy wins on the table simply bothers me.",
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

export type Project = {
  index: string;
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

export const experience = {
  company: "Medikzo",
  role: "Full-stack Developer",
  period: "Jan 2026 — Present",
  location: "Cooch Behar, West Bengal",
  blurb:
    "Leading development of a healthcare platform with 1,000+ downloads — a Turborepo monorepo housing a NestJS API with 229+ endpoints and three React frontends, unified by a shared Zod schema for end-to-end type safety.",
  highlights: [
    {
      title: "Architecture",
      body: "NestJS + PostgreSQL backend with 35+ TypeORM entities, CASL authorization across 5 roles, Server-Sent Events for real-time appointment tracking, webhook-driven telephony, and Algolia fuzzy search.",
    },
    {
      title: "Systems engineering",
      body: "SLA-driven assignment engine on AWS Lambda + SQS FIFO routing leads within 30 minutes. Pessimistic SKIP LOCKED row locks prevent duplicate assignments — 100% lead capture across tier-3 city operations.",
    },
    {
      title: "Infrastructure",
      body: "Infrastructure as code via CloudFormation, CI/CD through GitHub Actions with OIDC. Dockerized API on ECS Fargate behind an ALB — compute costs cut 60% via serverless workloads and Fargate Spot.",
    },
  ],
  metrics: [
    { value: "229+", label: "API endpoints" },
    { value: "35+", label: "TypeORM entities" },
    { value: "60%", label: "compute cost cut" },
    { value: "1,000+", label: "downloads" },
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
