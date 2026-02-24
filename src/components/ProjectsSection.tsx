import { ExternalLink, Github } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const transitionEase = [0.16, 1, 0.3, 1];

const projects = [
  {
    title: "DevsOwl",
    image: "https://res.cloudinary.com/ddyehcaeo/image/upload/v1771333552/z8hginpogt2glymf9sle.png", 
    description: "A centralized developer portfolio aggregator that visualizes cross-platform data. Features automated synchronization using GraphQL and SEO-friendly dynamic routing.",
    techstack: ["Next.js", "TypeScript", "PostgreSQL", "GraphQL"],
    github: "https://github.com/SSharma1103/devora",
    live: "https://devsowl.com/",
  },
  {
    title: "Heyllo.ai",
    image: "https://res.cloudinary.com/ddyehcaeo/image/upload/v1753271374/Screenshot_2025-07-23_at_5.19.20_PM_gkuvmm.png",
    description: "An AI-driven interview prep app simulating real-time call interviews. Dynamically generates follow-up questions and provides structured performance insights.",
    techstack: ["Next.js", "React", "Firebase", "AI Integration"],
    github: "https://github.com/srxshiv/heyllo.ai",
    live: "https://heylloai.vercel.app",
  },
  {
    title: "Wispr Flow",
    image: "https://res.cloudinary.com/ddyehcaeo/image/upload/v1766927655/Screenshot_2025-12-28_at_6.43.16_PM_ydntxb.png", 
    description: "A desktop-native voice-to-text application bridging a React frontend with a Rust backend via Tauri. Handles system-level tasks and OS accessibility permissions.",
    techstack: ["Tauri", "Rust", "React", "TypeScript"],
    github: "https://github.com/srxshiv/wispr_flow_tauri.git",
  },
  {
    title: "Uniwizz",
    image: "https://res.cloudinary.com/ddyehcaeo/image/upload/v1753271528/IMG_0490_md8el5.jpg",
    description: "A college-exclusive marketplace for buying/selling items and freelance services. Features official university email verification and real-time WebSocket chat.",
    techstack: ["React", "MongoDB", "Express", "WebSocket"],
    github: "https://github.com/srxshiv/UniWizz-frontend",
    live: "https://www.uniwizz.in",
  },
  {
    title: "Broke No More",
    image: "https://res.cloudinary.com/ddyehcaeo/image/upload/v1753394494/Screenshot_2025-07-25_at_3.20.32_AM_l33ytb.png",
    description: "A personal finance visualizer tracking spending through intuitive charts. Supports budget setting, transaction categorization, and clear financial insights.",
    techstack: ["Next.js", "MongoDB", "Tailwind"],
    github: "https://github.com/srxshiv/BrokeNoMore.git",
    live: "https://broke-no-more-seven.vercel.app",
  },
  {
    title: "Github-Profile-Analyzer",
    image: "https://res.cloudinary.com/ddyehcaeo/image/upload/v1753450510/Screenshot_2025-07-25_at_7.04.02_PM_kqoyag.png",
    description: "A visual tool mapping user repositories and contribution histories into interactive, readable data charts.",
    techstack: ["React", "TypeScript", "Tailwind"],
    github: "https://github.com/srxshiv/Github-Profile-Analyzer.git",
    live: "https://gitprofileanalyzer.vercel.app",
  },
];

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("All");

  // Extract unique top-level tech for the sleek filter
  const allTechs = ["All", ...Array.from(new Set(projects.flatMap(p => p.techstack)))].slice(0, 6);

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(project => project.techstack.includes(activeFilter));

  return (
    <section id="projects" className="relative py-32 px-6 md:px-24 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: transitionEase }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
      >
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            Selected Works.
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl">
            A collection of robust full-stack applications, desktop utilities, and interfaces I've built.
          </p>
        </div>

        {/* Minimalist Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {allTechs.map((tech) => (
            <button
              key={tech}
              onClick={() => setActiveFilter(tech)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === tech
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Fluid Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: any, index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: transitionEase, delay: index * 0.1 }}
      className="group flex flex-col gap-5"
    >
      {/* Image Container - No dark overlays, just clean scaling */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        
        {/* Floating Action Links (visible on hover for desktop, always visible on mobile via focus/tap) */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-900 dark:text-zinc-50 rounded-full hover:scale-110 transition-transform shadow-sm"
            >
              <Github size={18} />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-900 dark:text-zinc-50 rounded-full hover:scale-110 transition-transform shadow-sm"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Exposed Content Container */}
      <div className="flex flex-col gap-3">
        <h3 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
          {project.title}
        </h3>
        
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
          {project.description}
        </p>

        {/* Clean Tech Stack Text */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
          {project.techstack.map((tech: string) => (
            <span key={tech} className="text-sm font-medium text-zinc-500 dark:text-zinc-500">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}