import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const transitionEase = [0.16, 1, 0.3, 1];

const projects = [
  {
    title: "DevsOwl",
    image:
      "https://res.cloudinary.com/ddyehcaeo/image/upload/v1771333552/z8hginpogt2glymf9sle.png",
    description:
      "A centralized developer portfolio aggregator that visualizes cross-platform data. Features automated synchronization using GraphQL and SEO-friendly dynamic routing.",
    techstack: ["Next.js", "TypeScript", "PostgreSQL", "GraphQL"],
    github: "https://github.com/SSharma1103/devora",
    live: "https://devsowl.com/",
  },
  {
    title: "Heyllo.ai",
    image:
      "https://res.cloudinary.com/ddyehcaeo/image/upload/v1753271374/Screenshot_2025-07-23_at_5.19.20_PM_gkuvmm.png",
    description:
      "An AI-driven interview prep app simulating real-time call interviews. Dynamically generates follow-up questions and provides structured performance insights.",
    techstack: ["Next.js", "React", "Firebase", "AI Integration"],
    github: "https://github.com/srxshiv/heyllo.ai",
    live: "https://heylloai.vercel.app",
  },
  {
    title: "Wispr Flow",
    image:
      "https://res.cloudinary.com/ddyehcaeo/image/upload/v1766927655/Screenshot_2025-12-28_at_6.43.16_PM_ydntxb.png",
    description:
      "A desktop-native voice-to-text application bridging a React frontend with a Rust backend via Tauri. Handles system-level tasks and OS accessibility permissions.",
    techstack: ["Tauri", "Rust", "React", "TypeScript"],
    github: "https://github.com/srxshiv/wispr_flow_tauri.git",
  },
  {
    title: "Uniwizz",
    image:
      "https://res.cloudinary.com/ddyehcaeo/image/upload/v1753271528/IMG_0490_md8el5.jpg",
    description:
      "A college-exclusive marketplace for buying/selling items and freelance services. Features official university email verification and real-time WebSocket chat.",
    techstack: ["React", "MongoDB", "Express", "WebSocket"],
    github: "https://github.com/srxshiv/UniWizz-frontend",
    live: "https://www.uniwizz.in",
  },
  {
    title: "Broke No More",
    image:
      "https://res.cloudinary.com/ddyehcaeo/image/upload/v1753394494/Screenshot_2025-07-25_at_3.20.32_AM_l33ytb.png",
    description:
      "A personal finance visualizer tracking spending through intuitive charts. Supports budget setting, transaction categorization, and clear financial insights.",
    techstack: ["Next.js", "MongoDB", "Tailwind"],
    github: "https://github.com/srxshiv/BrokeNoMore.git",
    live: "https://broke-no-more-seven.vercel.app",
  },
  {
    title: "Github Profile Analyzer",
    image:
      "https://res.cloudinary.com/ddyehcaeo/image/upload/v1753450510/Screenshot_2025-07-25_at_7.04.02_PM_kqoyag.png",
    description:
      "A visual tool mapping user repositories and contribution histories into interactive, readable data charts.",
    techstack: ["React", "TypeScript", "Tailwind"],
    github: "https://github.com/srxshiv/Github-Profile-Analyzer.git",
    live: "https://gitprofileanalyzer.vercel.app",
  },
];

export function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = projects[activeIndex];

  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <section
      id="projects"
      className="relative py-24 md:py-32 px-6 md:px-24 max-w-7xl mx-auto overflow-hidden"
    >

      <div className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: transitionEase }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            Selected Works.
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
            Full-stack applications, desktop utilities, and interfaces.
          </p>
        </motion.div>

        {/* Desktop: Split Panel Layout */}
        <div className="hidden md:grid md:grid-cols-[1fr_1.2fr] gap-12 items-start">
          {/* Left — Project List */}
          <nav aria-label="Project list" className="flex flex-col">
            {projects.map((project, index) => (
              <button
                key={project.title}
                onClick={() => handleSelect(index)}
                onMouseEnter={() => handleSelect(index)}
                aria-current={index === activeIndex ? "true" : undefined}
                className={`group relative text-left py-5 transition-all duration-500 border-b border-zinc-200 dark:border-zinc-800 first:border-t ${
                  index === activeIndex
                    ? "opacity-100"
                    : "opacity-40 hover:opacity-70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                      {project.title}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className={`text-zinc-400 dark:text-zinc-500 transition-all duration-300 ${
                      index === activeIndex
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2"
                    }`}
                  />
                </div>

                {/* Tech stack shown inline on active */}
                <motion.div
                  initial={false}
                  animate={{
                    height: index === activeIndex ? "auto" : 0,
                    opacity: index === activeIndex ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: transitionEase }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-3 mt-2 ml-9">
                    {project.techstack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-medium text-zinc-500 dark:text-zinc-500"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </button>
            ))}
          </nav>

          {/* Right — Preview Panel */}
          <div className="sticky top-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: transitionEase }}
                className="flex flex-col gap-6"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <img
                    src={active.image}
                    alt={`Screenshot of ${active.title}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col gap-4">
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[15px]">
                    {active.description}
                  </p>

                  {/* Links */}
                  <div className="flex items-center gap-4">
                    {active.github && (
                      <a
                        href={active.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${active.title} source on GitHub`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                      >
                        <Github size={16} />
                        Source
                      </a>
                    )}
                    {active.live && (
                      <a
                        href={active.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${active.title} live site`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                      >
                        <ExternalLink size={16} />
                        Live
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile: Compact Accordion Cards */}
        <div className="md:hidden flex flex-col gap-3">
          {projects.map((project, index) => (
            <MobileProjectCard
              key={project.title}
              project={project}
              index={index}
              isOpen={index === activeIndex}
              onToggle={() =>
                setActiveIndex(index === activeIndex ? -1 : index)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileProjectCard({
  project,
  index,
  isOpen,
  onToggle,
}: {
  project: (typeof projects)[number];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      transition={{ duration: 0.4, ease: transitionEase }}
      className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950"
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-baseline gap-3">
          <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {project.title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: transitionEase }}
        >
          <ArrowUpRight
            size={16}
            className="text-zinc-400 dark:text-zinc-500"
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: transitionEase }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 flex flex-col gap-4">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <img
                  src={project.image}
                  alt={`Screenshot of ${project.title}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.techstack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-medium text-zinc-500 dark:text-zinc-500"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-1">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} source on GitHub`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-50"
                  >
                    <Github size={15} />
                    Source
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${project.title} live site`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-50"
                  >
                    <ExternalLink size={15} />
                    Live
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
