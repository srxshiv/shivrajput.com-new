import { Briefcase, MapPin, ArrowUpRight } from "lucide-react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const transitionEase = [0.16, 1, 0.3, 1];

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
  const [activeIndex, setActiveIndex] = useState(0);
  const active = experiences[activeIndex];

  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <section
      id="experience"
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
            Experience.
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
            My professional journey across development and engineering.
          </p>
        </motion.div>

        {/* Desktop: Split Panel Layout */}
        <div className="hidden md:grid md:grid-cols-[1fr_1.2fr] gap-12 items-start">
          {/* Left — Experience List */}
          <nav aria-label="Experience list" className="flex flex-col">
            {experiences.map((exp, index) => (
              <button
                key={exp.company}
                onClick={() => handleSelect(index)}
                onMouseEnter={() => handleSelect(index)}
                aria-current={index === activeIndex ? "true" : undefined}
                className={`group/item relative text-left py-5 transition-all duration-500 border-b border-zinc-200 dark:border-zinc-800 first:border-t ${
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
                      {exp.company}
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

                {/* Position & duration shown inline on active */}
                <motion.div
                  initial={false}
                  animate={{
                    height: index === activeIndex ? "auto" : 0,
                    opacity: index === activeIndex ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: transitionEase }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 mt-2 ml-9">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
                      {exp.position}
                    </span>
                    <span className="text-zinc-300 dark:text-zinc-700">·</span>
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
                      {exp.duration}
                    </span>
                  </div>
                </motion.div>
              </button>
            ))}
          </nav>

          {/* Right — Detail Panel */}
          <div className="sticky top-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.company}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: transitionEase }}
                className="flex flex-col gap-6"
              >
                {/* Role Header */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 text-xs font-mono tracking-tight rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                      {active.duration}
                    </span>
                    <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
                      <MapPin size={14} />
                      <span className="text-sm">{active.location}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {active.position}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[15px]">
                  {active.description}
                </p>

                {/* Achievements */}
                <ul className="flex flex-col gap-3">
                  {active.achievements.map((achievement, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400 text-[15px]"
                    >
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0" />
                      <span className="leading-relaxed">{achievement}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  {active.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm font-medium rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile: Compact Accordion Cards */}
        <div className="md:hidden flex flex-col gap-3">
          {experiences.map((exp, index) => (
            <MobileExperienceCard
              key={exp.company}
              experience={exp}
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

function MobileExperienceCard({
  experience,
  index,
  isOpen,
  onToggle,
}: {
  experience: (typeof experiences)[number];
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
            {experience.company}
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
              {/* Meta row */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-2.5 py-0.5 text-xs font-mono rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                  {experience.duration}
                </span>
                <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
                  <MapPin size={12} />
                  <span className="text-xs">{experience.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <Briefcase size={14} />
                <span className="text-sm font-medium">
                  {experience.position}
                </span>
              </div>

              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                {experience.description}
              </p>

              {/* Achievements */}
              <ul className="flex flex-col gap-2">
                {experience.achievements.map((achievement, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-zinc-600 dark:text-zinc-400 text-sm"
                  >
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0" />
                    <span className="leading-relaxed">{achievement}</span>
                  </li>
                ))}
              </ul>

              {/* Tech */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                {experience.tech.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-medium text-zinc-500 dark:text-zinc-500"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
