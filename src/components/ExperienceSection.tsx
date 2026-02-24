import { motion } from "framer-motion";

const transitionEase = [0.16, 1, 0.3, 1];

const experiences = [
  {
    company: "Messy Programmer",
    position: "AI Fullstack Developer",
    duration: "Jan 2026 — Present",
    location: "Cooch Behar, WB",
    description:
      "Building high-performance AI-driven fullstack applications end-to-end using a TypeScript-first stack with modern cloud and automation tooling.",
    achievements: [
      "Engineered scalable fullstack apps using Next.js, React, Node.js with Dockerized services for consistent deployments.",
      "Developed backend systems with PostgreSQL, MongoDB, and Firebase, implementing secure OAuth 2.0 authentication.",
      "Developed complex workflow automations using n8n, Zapier, and Pipedream with custom APIs and webhooks.",
      "Integrated GoHighLevel ecosystems and built internal tools using Retool, Payload CMS, and Directus.",
    ],
    tech: [
      "Next.js", "TypeScript", "Node.js", "PostgreSQL", "n8n", "Zapier", "React Native"
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
  return (
    <section id="experience" className="relative py-32 px-6 md:px-24 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: transitionEase }}
        className="mb-20"
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
          Experience.
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-xl text-lg">
          My professional journey across development and engineering.
        </p>
      </motion.div>

      {/* The Asymmetrical Grid Layout */}
      <div className="flex flex-col gap-16 md:gap-24">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: transitionEase, delay: index * 0.1 }}
            className="group grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] gap-6 md:gap-12"
          >
            {/* Left Column: Meta Data */}
            <div className="flex flex-col md:pr-8">
              <span className="text-zinc-400 dark:text-zinc-500 font-mono text-sm tracking-tight mb-2">
                {exp.duration}
              </span>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
                {exp.position}
              </h3>
              <span className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                {exp.location}
              </span>
            </div>

            {/* Right Column: Content */}
            <div className="flex flex-col gap-6">
              <h4 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {exp.company}
              </h4>
              
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base md:text-lg">
                {exp.description}
              </p>

              {/* Minimalist Bullet Points */}
              <ul className="flex flex-col gap-3">
                {exp.achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start gap-4 text-zinc-600 dark:text-zinc-400">
                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 shrink-0" />
                    <span className="leading-relaxed">{achievement}</span>
                  </li>
                ))}
              </ul>

              {/* Seamless Tech Pills matching the Projects section */}
              <div className="flex flex-wrap gap-2 mt-4">
                {exp.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-sm font-medium rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 transition-colors group-hover:border-zinc-300 dark:group-hover:border-zinc-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}