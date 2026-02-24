import { MapPin, Plus, ArrowRight } from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, type Easing } from "framer-motion";

const transitionEase: Easing = [0.16, 1, 0.3, 1];

const experiences = [
  {
    company: "Messy Programmer",
    position: "AI Fullstack Developer",
    duration: "Jan 2026 — Present",
    location: "Cooch Behar, WB",
    description:
      "Building high-performance AI-driven fullstack applications for International clients end-to-end using a TypeScript-first stack with modern cloud and automation tooling.",
    achievements: [
      "Engineered scalable fullstack apps using Next.js, React, Node.js with Dockerized services for consistent deployments.",
      "Developed backend systems with PostgreSQL, MongoDB, and Firebase, implementing secure OAuth 2.0 authentication.",
      "Developed complex workflow automations using n8n, Zapier, and Pipedream with custom APIs and webhooks.",
      "Integrated GoHighLevel ecosystems and built internal tools using Retool, Payload CMS, and Directus.",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "n8n",
      "Zapier",
      "React Native",
      'React'
    ],
  },
  {
    company: "Harshey Health Care Hospital",
    position: "Full Stack Developer",
    duration: "Dec 2022 — Jan 2023",
    location: "Remote",
    description:
      "Engineered a comprehensive Clinic Management System supporting multiple doctors and managing 200+ patient records to digitize daily operations.",
    achievements: [
      "Implemented secure token-based authentication for patient management, significantly reducing manual scheduling time.",
      "Designed RESTful APIs to optimize database operations for medical histories and billing.",
      "Achieved sub-200ms data retrieval speeds through optimized MongoDB queries.",
    ],
    tech: ["React", "Express", "MongoDB", "Node.js", "REST APIs"],
  },
];

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Open the first item by default
  const [expandedIndex, setExpandedIndex] = useState<number | null>();

  // Scroll tracking for the fade in/out effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const yParallax = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [40, 0, 0, -40]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 max-w-6xl mx-auto overflow-hidden"
    >
      <motion.div
        style={{ opacity, y: yParallax }}
        className="relative z-10 w-full"
      >
        {/* Minimalist Section Header */}
        <div className=" flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <div className="mb-20 md:mb-32">
            <h1 className="text-6xl md:text-6xl font-medium tracking-tighter mb-6 text-zinc-900 dark:text-zinc-50">
            Professional journey across development.
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-zinc-400 font-mono tracking-widest uppercase">
            <span>0{experiences.length} Roles</span>
          </div>
        </div>

        {/* The Interactive Ledger */}
        <div className="flex flex-col">
          {experiences.map((exp, index) => (
            <ExperienceRow
              key={exp.company}
              experience={exp}
              isOpen={expandedIndex === index}
              onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ExperienceRow({
  experience,
  isOpen,
  onToggle,
}: {
  experience: (typeof experiences)[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={false}
      className={`border-zinc-200 dark:border-zinc-800 transition-colors duration-500 group ${
        isOpen
          ? "bg-zinc-50 dark:bg-zinc-900/50"
          : "hover:bg-zinc-50 dark:hover:bg-zinc-900/30"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full py-8 md:py-12 flex flex-col md:flex-row md:items-center text-left gap-4 md:gap-8 px-4 md:px-6"
      >
        {/* Left: Duration */}
        <div className="md:w-1/4 shrink-0">
          <span className="font-mono text-sm text-zinc-400 dark:text-zinc-500 tracking-tight">
            {experience.duration}
          </span>
        </div>

        {/* Center: Company Name (The massive typographic element) */}
        <div className="md:w-1/2 flex-1">
          <h3 className={`text-2xl md:text-4xl lg:text-4xl tracking-tighter transition-colors duration-500 ${isOpen ? "font-medium text-zinc-900 dark:text-zinc-50" : "font-light text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-300"}`}>
            {experience.position}
          </h3>
        </div>

        {/* Right: Position & Icon */}
        <div className="md:w-1/4 flex justify-between md:justify-end items-center gap-6 mt-4 md:mt-0 shrink-0">
          <span className="text-base md:text-lg font-light text-zinc-500 dark:text-zinc-400 text-left md:text-right">
            {experience.company}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.4, ease: transitionEase }}
            className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 group-hover:border-zinc-400 dark:group-hover:text-zinc-50 dark:group-hover:border-zinc-500 transition-colors duration-300"
          >
            <Plus size={16} strokeWidth={1.5} />
          </motion.div>
        </div>
      </button>

      {/* Expandable Content sub-grid */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: transitionEase }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-6 pb-12 pt-2 md:pt-4 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12">

              {/* Left Column: Context & Tech */}
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
                    <MapPin size={14} />
                    <span className="text-sm font-medium tracking-wide uppercase">{experience.location}</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-light text-base">
                    {experience.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {experience.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-mono tracking-tight rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Achievements */}
              <div className="flex flex-col">
                <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase mb-6">Key Achievements</span>
                <ul className="flex flex-col gap-5">
                  {experience.achievements.map((achievement, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i + 0.2, duration: 0.5, ease: transitionEase }}
                      className="flex items-start gap-4 text-zinc-700 dark:text-zinc-300 text-base font-light"
                    >
                      <ArrowRight size={16} className="mt-1 shrink-0 text-zinc-300 dark:text-zinc-600" />
                      <span className="leading-relaxed">{achievement}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}