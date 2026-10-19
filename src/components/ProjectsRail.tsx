"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  X,
  Lightbulb,
  Sparkles,
  Gauge,
  Wrench,
  Smile,
  Loader2,
} from "lucide-react";
import { projects as staticProjects } from "@/lib/data";
import { GithubIcon } from "./BrandIcons";
import { track } from "@/lib/track";

const EASE = [0.25, 1, 0.5, 1] as const;

/* alternating resting tilts */
const tilts = [-1.6, 1.3, -1.1, 1.5, -1.3];

export type StoryItem = {
  kind: "decision" | "feature" | "metric" | "challenge" | "quirk";
  title: string;
  body: string;
};

export type ProjectLevel = "advanced" | "intermediate" | "beginner";

export type RailProject = {
  id?: string;
  slug: string;
  title: string;
  year: string;
  summary: string;
  detail: string;
  image: string | null;
  live: string | null;
  github: string | null;
  stack: string[];
  story: StoryItem[];
  level: ProjectLevel;
};

/* stacked top to bottom — hardest first */
const LEVELS: { key: ProjectLevel; label: string; note: string }[] = [
  { key: "advanced", label: "advanced", note: "the deep end — systems, not screens" },
  { key: "intermediate", label: "intermediate", note: "shipped, used, maintained" },
  { key: "beginner", label: "beginner", note: "where the reps started" },
];

const STORY_META: Record<
  StoryItem["kind"],
  { icon: React.ElementType; label: string; accent: boolean }
> = {
  decision: { icon: Lightbulb, label: "decision", accent: false },
  feature: { icon: Sparkles, label: "feature", accent: false },
  metric: { icon: Gauge, label: "metric", accent: true },
  challenge: { icon: Wrench, label: "challenge", accent: false },
  quirk: { icon: Smile, label: "aside", accent: false },
};

/* fallback if the database is briefly unreachable */
const FALLBACK: RailProject[] = staticProjects.map((p) => ({
  slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  title: p.title,
  year: p.year,
  summary: p.summary,
  detail: p.detail,
  image: p.image ?? null,
  live: p.live ?? null,
  github: p.github ?? null,
  stack: p.stack,
  story: [],
  level: p.level,
}));

const isLevel = (value: unknown): value is ProjectLevel =>
  value === "advanced" || value === "intermediate" || value === "beginner";

/** Card that tilts in 3D toward the cursor and springs back on leave. */
function ProjectCard({
  project,
  index,
  tilt,
  onOpen,
}: {
  project: RailProject;
  index: number;
  tilt: number;
  onOpen: () => void;
}) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 260, damping: 20 });
  const sry = useSpring(ry, { stiffness: 260, damping: 20 });

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - rect.left) / rect.width - 0.5) * 10);
    rx.set(((e.clientY - rect.top) / rect.height - 0.5) * -10);
  };
  const onMouseLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div className="relative shrink-0 snap-start pt-10">
      {/* giant outlined numeral peeking above the card */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-2 left-1 z-0 select-none font-mono text-[6rem] font-bold leading-none tracking-tighter text-transparent opacity-90 [-webkit-text-stroke:2px_var(--faint)]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <motion.article
        initial={{ rotate: tilt }}
        whileHover={{ rotate: 0, y: -10, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onOpen()}
        aria-label={`Open ${project.title} case file`}
        className="group relative z-10 h-full w-[78vw] max-w-[330px] cursor-pointer [perspective:900px]"
      >
        <motion.div
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          style={{ rotateX: srx, rotateY: sry }}
          className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_2px_20px_rgba(0,0,0,0.05)] transition-[border-color,box-shadow] duration-300 group-hover:border-foreground/20 group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.3)] dark:group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-background">
            {project.image && (
              // arbitrary admin-supplied hosts — plain img avoids the
              // next/image remotePatterns allow-list
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.image}
                alt={`${project.title} screenshot`}
                draggable={false}
                loading="lazy"
                className="h-full w-full object-cover object-top grayscale-[0.85] transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
              />
            )}
            <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
              case file · {project.year}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-3 p-7">
            <h3 className="text-xl font-medium tracking-tight text-foreground md:text-2xl">
              {project.title}
            </h3>
            <p className="text-[15px] font-light leading-relaxed text-muted">
              {project.summary}
            </p>
            <div className="mt-auto flex items-center justify-between pt-4">
              <div className="flex flex-wrap gap-1.5">
                {project.stack.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-line bg-background px-3 py-1 font-mono text-[10px] tracking-tight text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <span className="flex shrink-0 items-center gap-1 text-[13px] font-medium text-faint transition-colors duration-300 group-hover:text-accent">
                the story
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </motion.div>
      </motion.article>
    </div>
  );
}

/** The case file — spec header, then the project tells its own story. */
function ProjectModal({
  project,
  index,
  onClose,
}: {
  project: RailProject;
  index: number;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  /* portal to <body> — ancestor filter/blur transitions trap fixed overlays */
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-md md:p-8 dark:bg-black/70"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40, rotate: -1.5 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24, rotate: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={project.title}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-3xl border border-line bg-background shadow-[0_32px_100px_rgba(0,0,0,0.3)]"
      >
        {project.image && (
          <div className="relative aspect-[16/7] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              className="h-full w-full object-cover object-top"
            />
            <motion.button
              onClick={onClose}
              aria-label="Close"
              whileHover={{ rotate: 90, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 16 }}
              className="glass absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>
        )}

        <div className="flex flex-col gap-5 p-7 md:p-9">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              {project.title}
            </h3>
            <span className="shrink-0 font-mono text-xs text-faint">
              #{String(index + 1).padStart(2, "0")} · {project.year}
            </span>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            {project.summary}
          </p>
          <p className="text-[15px] font-light leading-relaxed text-muted">
            {project.detail}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[10.5px] tracking-tight text-muted"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {project.live && (
              <motion.a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("project_live_click", { slug: project.slug })}
                whileHover={{ scale: 1.05, rotate: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 16 }}
                className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
              >
                Visit live
                <ArrowUpRight className="h-4 w-4" />
              </motion.a>
            )}
            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("project_source_click", { slug: project.slug })}
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 16 }}
                className="flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-muted transition-colors duration-300 hover:border-foreground/30 hover:text-foreground"
              >
                <GithubIcon className="h-4 w-4" />
                Source
              </motion.a>
            )}
          </div>

          {/* ── the story timeline ─────────────────── */}
          {project.story.length > 0 && (
            <div className="mt-2">
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-faint">
                  the story
                </p>
                <p className="handwritten rotate-[-2deg] text-base text-faint">
                  scroll — it tells itself ↓
                </p>
              </div>

              <div className="mt-5 flex flex-col">
                {project.story.map((item, i) => {
                  const meta = STORY_META[item.kind] ?? STORY_META.feature;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="group relative flex gap-4 pb-7 last:pb-0"
                    >
                      {/* spine */}
                      <div className="relative flex w-8 shrink-0 justify-center">
                        {i < project.story.length - 1 && (
                          <span className="absolute top-8 h-full w-px bg-line" />
                        )}
                        <span
                          className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border ${
                            meta.accent
                              ? "border-accent/50 bg-accent/10 text-accent"
                              : "border-line bg-surface text-muted"
                          }`}
                        >
                          <meta.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </span>
                      </div>

                      <div className="min-w-0 pt-1">
                        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                          <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-faint">
                            {meta.label}
                          </span>
                          <h4
                            className={`text-[15px] font-medium tracking-tight ${
                              meta.accent ? "text-accent" : "text-foreground"
                            }`}
                          >
                            {item.title}
                          </h4>
                        </div>
                        <p
                          className={`mt-1.5 text-[13.5px] leading-relaxed ${
                            item.kind === "quirk"
                              ? "handwritten rotate-[-0.5deg] text-[16px] text-muted"
                              : "font-light text-muted"
                          }`}
                        >
                          {item.body}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <p className="handwritten mt-6 rotate-[-1.5deg] text-center text-lg text-faint">
                — end of case file #{String(index + 1).padStart(2, "0")} —
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

/** One horizontal rail — a single difficulty tier, drag-scrolled on its own. */
function LevelRail({
  label,
  note,
  items,
  showTail,
  onOpen,
}: {
  label: string;
  note: string;
  items: { project: RailProject; index: number }[];
  showTail: boolean;
  onOpen: (index: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0, moved: 0 });
  const [grabbing, setGrabbing] = useState(false);
  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, { stiffness: 140, damping: 26 });

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    progress.set(max > 0 ? el.scrollLeft / max : 0);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!el) return;
    drag.current = {
      down: true,
      startX: e.pageX,
      scrollLeft: el.scrollLeft,
      moved: 0,
    };
    setGrabbing(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!el || !drag.current.down) return;
    const dx = e.pageX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    el.scrollLeft = drag.current.scrollLeft - dx;
  };

  const endDrag = () => {
    drag.current.down = false;
    setGrabbing(false);
  };

  /* swallow clicks that were actually drags */
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const scrollByCard = useCallback((dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 440, behavior: "smooth" });
  }, []);

  return (
    <section className="py-4">
      <div className="flex items-end justify-between gap-4 pl-10 pr-6">
        <div className="min-w-0">
          <div className="flex items-baseline gap-3">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-foreground">
              {label}
            </h2>
            <span className="font-mono text-[10px] text-faint">
              {items.length} {items.length === 1 ? "file" : "files"}
            </span>
          </div>
          <p className="handwritten mt-0.5 rotate-[-1.5deg] text-base text-faint">
            {note}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {([-1, 1] as const).map((dir) => (
            <motion.button
              key={dir}
              onClick={() => scrollByCard(dir)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              aria-label={`Scroll ${label} projects ${dir === -1 ? "left" : "right"}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-foreground/30 hover:text-foreground"
            >
              {dir === -1 ? (
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={onScroll}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onClickCapture={onClickCapture}
        // scroll-pl matches pl — without it snap-start pins the first card
        // flush to the container edge and eats the padding
        className={`no-scrollbar mt-2 flex snap-x snap-mandatory gap-7 overflow-x-auto scroll-pl-10 py-2 pb-4 pl-10 pr-6 select-none ${
          grabbing ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {items.map(({ project, index }) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={index}
            tilt={tilts[index % tilts.length]}
            onOpen={() => onOpen(index)}
          />
        ))}
        {showTail && (
          <div className="flex w-[220px] shrink-0 snap-start items-center justify-center">
            <motion.a
              href="https://github.com/srxshiv"
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
              whileHover={{ rotate: 0, scale: 1.06 }}
              className="handwritten rotate-3 text-center text-2xl text-faint transition-colors duration-300 hover:text-foreground"
            >
              more on my github →
            </motion.a>
          </div>
        )}
      </div>

      {/* scrub bar mirrors rail position */}
      <div className="mx-auto mt-2 h-px w-48 overflow-hidden rounded-full bg-line">
        <motion.div
          style={{ scaleX: smoothProgress, originX: 0 }}
          className="h-full w-full bg-foreground"
        />
      </div>
    </section>
  );
}

export function WorkContent() {
  const [projects, setProjects] = useState<RailProject[] | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/projects")
      .then((r) => r.json())
      .then((json) => {
        if (!alive) return;
        const rows = (json.projects ?? []) as RailProject[];
        setProjects(rows.length > 0 ? rows : FALLBACK);
      })
      .catch(() => alive && setProjects(FALLBACK));
    return () => {
      alive = false;
    };
  }, []);

  const openProject = (i: number) => {
    setSelected(i);
    if (projects?.[i]) track("project_open", { slug: projects[i].slug });
  };

  if (projects === null) {
    return (
      <div className="flex h-full items-center justify-center gap-2 p-10 text-faint">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="font-mono text-[12px]">opening the filing cabinet…</span>
      </div>
    );
  }

  /* keep the case-file numbering global, then split into tiers.
     anything with an unknown level falls into intermediate. */
  const tiers = LEVELS.map((level) => ({
    ...level,
    items: projects
      .map((project, index) => ({ project, index }))
      .filter(({ project }) =>
        isLevel(project.level)
          ? project.level === level.key
          : level.key === "intermediate"
      ),
  })).filter((tier) => tier.items.length > 0);

  return (
    <div className="py-5">
      <p className="handwritten rotate-[-2deg] pl-10 pr-6 text-lg">
        {projects.length} case files — hardest first, scroll down for the rest ↓
      </p>

      <div className="mt-1 flex flex-col divide-y divide-line">
        {tiers.map((tier, i) => (
          <LevelRail
            key={tier.key}
            label={tier.label}
            note={tier.note}
            items={tier.items}
            showTail={i === tiers.length - 1}
            onOpen={openProject}
          />
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && projects[selected] && (
          <ProjectModal
            project={projects[selected]}
            index={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
