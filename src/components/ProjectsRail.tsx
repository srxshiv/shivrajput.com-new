"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { projects, type Project } from "@/lib/data";
import { GithubIcon } from "./BrandIcons";

const EASE = [0.25, 1, 0.5, 1] as const;

/* alternating resting tilts */
const tilts = [-1.6, 1.3, -1.1, 1.5, -1.3];

/** Case-file card: giant index numeral, photo develops on hover, 3D tilt. */
function ProjectCard({
  project,
  index,
  tilt,
  onOpen,
}: {
  project: Project;
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
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            {/* photo "develops" from grayscale on hover */}
            <Image
              src={project.image}
              alt={`${project.title} screenshot`}
              fill
              sizes="400px"
              draggable={false}
              className="object-cover object-top grayscale-[0.85] transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
            />
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
                open file
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </motion.div>
      </motion.article>
    </div>
  );
}

/** Spec-sheet modal — reads like a technical datasheet. */
function ProjectModal({
  project,
  index,
  onClose,
}: {
  project: Project;
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

  const specRows: [string, React.ReactNode][] = [
    ["file", `#${String(index + 1).padStart(2, "0")} · ${project.title}`],
    ["year", project.year],
    ["role", "designed & built solo"],
    [
      "status",
      project.live ? (
        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> live in
          production
        </span>
      ) : (
        "source available"
      ),
    ],
  ];

  /* portal to <body> — an ancestor's filter/blur transition would otherwise
     trap this fixed overlay inside the panel's stacking context */
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
        className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-line bg-background shadow-[0_32px_100px_rgba(0,0,0,0.3)]"
      >
        <div className="relative aspect-[16/8] w-full">
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover object-top"
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

        <div className="grid grid-cols-1 gap-8 p-7 md:grid-cols-[1.5fr_1fr] md:p-10">
          {/* narrative */}
          <div className="flex flex-col gap-5">
            <h3 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              {project.title}
            </h3>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              {project.summary}
            </p>
            <p className="text-[15px] font-light leading-relaxed text-muted">
              {project.detail}
            </p>
            <div className="mt-1 flex items-center gap-3">
              {project.live && (
                <motion.a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
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
          </div>

          {/* spec table */}
          <div className="flex flex-col self-start rounded-2xl border border-line bg-surface font-mono text-[12px]">
            {specRows.map(([key, val]) => (
              <div
                key={key}
                className="flex items-baseline justify-between gap-4 border-b border-line px-4 py-3 last:border-none"
              >
                <span className="uppercase tracking-[0.15em] text-faint">
                  {key}
                </span>
                <span className="text-right text-foreground">{val}</span>
              </div>
            ))}
            <div className="flex flex-wrap gap-1.5 px-4 py-3">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-line bg-background px-2.5 py-1 text-[10px] tracking-tight text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

export function WorkContent() {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0, moved: 0 });
  const [grabbing, setGrabbing] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, { stiffness: 140, damping: 26 });

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    progress.set(max > 0 ? track.scrollLeft / max : 0);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;
    drag.current = {
      down: true,
      startX: e.pageX,
      scrollLeft: track.scrollLeft,
      moved: 0,
    };
    setGrabbing(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const track = trackRef.current;
    if (!track || !drag.current.down) return;
    const dx = e.pageX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    track.scrollLeft = drag.current.scrollLeft - dx;
  };

  const endDrag = () => {
    drag.current.down = false;
    setGrabbing(false);
  };

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
    <div className="py-5">
      <div className="flex items-center justify-between pl-10 pr-6">
        <p className="handwritten rotate-[-2deg] text-lg">
          five case files — drag through, open one →
        </p>
        <div className="flex items-center gap-2">
          {([-1, 1] as const).map((dir) => (
            <motion.button
              key={dir}
              onClick={() => scrollByCard(dir)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              aria-label={dir === -1 ? "Scroll projects left" : "Scroll projects right"}
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
        {projects.map((project, i) => (
          <ProjectCard
            key={project.title}
            project={project}
            index={i}
            tilt={tilts[i % tilts.length]}
            onOpen={() => setSelected(i)}
          />
        ))}
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
      </div>

      {/* scrub bar mirrors rail position */}
      <div className="mx-auto mt-2 h-px w-48 overflow-hidden rounded-full bg-line">
        <motion.div
          style={{ scaleX: smoothProgress, originX: 0 }}
          className="h-full w-full bg-foreground"
        />
      </div>

      <AnimatePresence>
        {selected !== null && (
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
