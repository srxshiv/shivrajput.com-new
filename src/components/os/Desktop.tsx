"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileHeart,
  FolderGit2,
  GitCommitHorizontal,
  Braces,
  Mail,
  Terminal as TerminalIcon,
  FileText,
  ChevronLeft,
} from "lucide-react";
import { Gate, type Mode } from "./Gate";
import { MenuBar } from "./MenuBar";
import { Dock, type DockApp } from "./Dock";
import { ProfileRail } from "./ProfileRail";
import { DotGrid } from "../DotGrid";
import { TerminalBody } from "../Terminal";
import { CoverLetter } from "../CoverLetter";
import { WorkContent } from "../ProjectsRail";
import { ExperienceContent } from "../Experience";
import { SkillsContent } from "../Skills";
import { ContactContent } from "../Contact";
import { site } from "@/lib/data";

const EASE = [0.25, 1, 0.5, 1] as const;

export type AppId =
  | "letter"
  | "work"
  | "experience"
  | "skills"
  | "contact"
  | "terminal";

type AppDef = {
  id: AppId;
  label: string;
  title: string;
  icon: React.ElementType;
  render: (mode: Mode) => React.ReactNode;
};

const APPS: AppDef[] = [
  {
    id: "letter",
    label: "Cover letter",
    title: "README.for-you.md",
    icon: FileHeart,
    render: (mode) => <CoverLetter mode={mode} />,
  },
  {
    id: "work",
    label: "Work",
    title: "work — 5 case files",
    icon: FolderGit2,
    render: () => <WorkContent />,
  },
  {
    id: "experience",
    label: "Experience",
    title: "medikzo — git log",
    icon: GitCommitHorizontal,
    render: () => <ExperienceContent />,
  },
  {
    id: "skills",
    label: "package.json",
    title: "shiv/package.json",
    icon: Braces,
    render: () => <SkillsContent />,
  },
  {
    id: "contact",
    label: "Contact",
    title: "new-request.http",
    icon: Mail,
    render: () => <ContactContent />,
  },
  {
    id: "terminal",
    label: "Terminal",
    title: "shiv@portfolio — zsh",
    icon: TerminalIcon,
    render: () => <TerminalBody height={420} />,
  },
];

/* what each audience sees first, and in what order */
const MODE_CONFIG: Record<Mode, { defaultApp: AppId; order: AppId[] }> = {
  recruiter: {
    defaultApp: "letter",
    order: ["letter", "experience", "work", "skills", "contact", "terminal"],
  },
  developer: {
    defaultApp: "terminal",
    order: ["terminal", "work", "skills", "experience", "letter", "contact"],
  },
  visitor: {
    defaultApp: "work",
    order: ["work", "experience", "skills", "letter", "contact", "terminal"],
  },
};

const MODE_KEY = "shivos-mode";

/* ───────────────────────── boot screen ───────────────────────── */

function BootScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, 1400);
    return () => clearTimeout(id);
  }, [onDone]);

  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.45 } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-background"
    >
      <motion.p
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="font-mono text-2xl font-semibold tracking-tight text-foreground"
      >
        ❖ ShivOS
      </motion.p>
      <div className="h-1 w-44 overflow-hidden rounded-full bg-line">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="h-full w-full origin-left bg-foreground"
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="font-mono text-[11px] text-faint"
      >
        loading portfolio.dmg — no scroll required
      </motion.p>
    </motion.div>
  );
}

/* ─────────────────────────── the stage ────────────────────────── */

function Stage({
  app,
  mode,
  maximized,
  onToggleMax,
  onHome,
}: {
  app: AppDef;
  mode: Mode;
  maximized: boolean;
  onToggleMax: () => void;
  onHome: () => void;
}) {
  const [protest, setProtest] = useState(false);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-background shadow-[0_16px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_60px_rgba(0,0,0,0.4)]">
      {/* stage chrome */}
      <div className="relative flex shrink-0 items-center justify-between border-b border-line bg-surface px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={onHome}
            aria-label="Back to the default app"
            className="h-3 w-3 rounded-full bg-red-400 transition-transform hover:scale-110"
          />
          <button
            onClick={() => {
              setProtest(true);
              setTimeout(() => setProtest(false), 1800);
            }}
            aria-label="Minimize (it refuses)"
            className="h-3 w-3 rounded-full bg-amber-400 transition-transform hover:scale-110"
          />
          <button
            onClick={onToggleMax}
            aria-label={maximized ? "Restore layout" : "Maximize stage"}
            className="h-3 w-3 rounded-full bg-emerald-400 transition-transform hover:scale-110"
          />
          <AnimatePresence>
            {protest && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0, rotate: -2 }}
                exit={{ opacity: 0 }}
                className="handwritten pl-1 text-sm text-faint"
              >
                minimize? and hide my own portfolio? no.
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 font-mono text-[11px] text-faint">
          {app.title}
        </span>
        <span className="font-mono text-[10px] text-faint/60">
          {maximized ? "tiled · max" : "tiled"}
        </span>
      </div>

      {/* stage content — swaps with a spring, never overlaps anything */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 24, scale: 0.985, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              y: -16,
              scale: 0.99,
              filter: "blur(6px)",
              transition: { duration: 0.22 },
            }}
            transition={{ duration: 0.45, ease: EASE }}
            className="h-full overflow-y-auto overscroll-contain"
          >
            {app.render(mode)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────── mobile home screen ───────────────────── */

function MobileOS({ mode }: { mode: Mode }) {
  const config = MODE_CONFIG[mode];
  const [openApp, setOpenApp] = useState<AppId | null>(null);
  const app = APPS.find((a) => a.id === openApp);

  useEffect(() => {
    const onOpen = (e: Event) =>
      setOpenApp((e as CustomEvent<AppId>).detail ?? null);
    window.addEventListener("os-open", onOpen);
    return () => window.removeEventListener("os-open", onOpen);
  }, []);

  const ordered = config.order.map((id) => APPS.find((a) => a.id === id)!);

  return (
    <div className="relative flex h-svh flex-col overflow-hidden">
      <DotGrid />

      <div className="relative z-10 px-7 pt-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-faint">
          ❖ ShivOS · viewing as {mode}
        </p>
        <h1 className="mt-3 text-5xl font-medium tracking-tighter text-foreground">
          Hi, I&apos;m Shiv.
        </h1>
        <p className="mt-3 text-sm font-light leading-relaxed text-muted">
          <span className="text-foreground">CS enthusiast</span> — doing
          full-stack development right now. Tap an app.
        </p>
      </div>

      <div className="relative z-10 mt-9 grid grid-cols-4 gap-x-4 gap-y-6 px-7">
        {ordered.map((appDef, i) => (
          <motion.button
            key={appDef.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.06 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => setOpenApp(appDef.id)}
            className="flex flex-col items-center gap-2"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-surface text-muted shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
              <appDef.icon className="h-6 w-6" strokeWidth={1.5} />
            </span>
            <span className="text-[10px] font-medium text-muted">
              {appDef.id === "skills" ? "pkg.json" : appDef.id}
            </span>
          </motion.button>
        ))}
        <motion.a
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
          href={site.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-surface text-muted shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
            <FileText className="h-6 w-6" strokeWidth={1.5} />
          </span>
          <span className="text-[10px] font-medium text-muted">resume</span>
        </motion.a>
      </div>

      <p className="handwritten absolute bottom-7 left-1/2 z-10 w-full -translate-x-1/2 rotate-[-2deg] text-center text-lg text-faint">
        the desktop version has a real dock — worth a laptop visit
      </p>

      <AnimatePresence>
        {app && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed inset-0 z-50 flex flex-col bg-background"
          >
            <div className="relative flex items-center gap-3 border-b border-line px-4 py-3">
              <button
                onClick={() => setOpenApp(null)}
                aria-label="Back"
                className="flex items-center gap-1 text-sm font-medium text-muted"
              >
                <ChevronLeft className="h-4 w-4" /> back
              </button>
              <span className="absolute left-1/2 -translate-x-1/2 font-mono text-[11px] text-faint">
                {app.title}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {app.render(mode)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ────────────────────────── the workspace ─────────────────────── */

export function Desktop() {
  const [booted, setBooted] = useState(false);
  const [mode, setMode] = useState<Mode | null>(null);
  const [gateDone, setGateDone] = useState(false);
  const [activeApp, setActiveApp] = useState<AppId>("letter");
  const [maximized, setMaximized] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // restore a previous choice
  useEffect(() => {
    const stored = sessionStorage.getItem(MODE_KEY) as Mode | null;
    if (stored && ["recruiter", "developer", "visitor"].includes(stored)) {
      setMode(stored);
      setActiveApp(MODE_CONFIG[stored].defaultApp);
      setGateDone(true);
    }
  }, []);

  const pickMode = (picked: Mode) => {
    sessionStorage.setItem(MODE_KEY, picked);
    setMode(picked);
    setActiveApp(MODE_CONFIG[picked].defaultApp);
    setGateDone(true);
  };

  const switchMode = () => {
    sessionStorage.removeItem(MODE_KEY);
    setGateDone(false);
    setMode(null);
  };

  // terminal + palette open apps from anywhere
  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<string>).detail as AppId;
      if (APPS.some((a) => a.id === id)) setActiveApp(id);
    };
    window.addEventListener("os-open", onOpen);
    return () => window.removeEventListener("os-open", onOpen);
  }, []);

  if (isDesktop === null) return <div className="h-svh" />;

  const gate = (
    <AnimatePresence>
      {booted && !gateDone && <Gate onPick={pickMode} />}
    </AnimatePresence>
  );

  if (!isDesktop) {
    return (
      <>
        <AnimatePresence>
          {!booted && <BootScreen onDone={() => setBooted(true)} />}
        </AnimatePresence>
        {gate}
        {mode && gateDone && <MobileOS mode={mode} />}
      </>
    );
  }

  const config = mode ? MODE_CONFIG[mode] : MODE_CONFIG.visitor;
  const orderedApps: DockApp[] = config.order.map((id) => {
    const app = APPS.find((a) => a.id === id)!;
    return { id: app.id, label: app.label, icon: app.icon };
  });
  const stageApp = APPS.find((a) => a.id === activeApp)!;

  return (
    <div className="relative h-svh overflow-hidden">
      <AnimatePresence>
        {!booted && <BootScreen onDone={() => setBooted(true)} />}
      </AnimatePresence>
      {gate}

      {mode && gateDone && (
        <>
          <MenuBar mode={mode} onSwitchMode={switchMode} />

          {/* wallpaper */}
          <div className="absolute inset-0" aria-hidden>
            <DotGrid />
          </div>

          {/* the tiling — rail + stage, side by side, never overlapping */}
          <div className="absolute inset-x-4 bottom-24 top-14 flex gap-4">
            <motion.aside
              ref={railRef}
              initial={{ opacity: 0, x: -24 }}
              animate={{
                opacity: maximized ? 0 : 1,
                x: maximized ? -32 : 0,
                width: maximized ? 0 : 300,
                marginRight: maximized ? -16 : 0,
              }}
              transition={{ duration: 0.5, ease: EASE }}
              className="shrink-0 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_16px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_60px_rgba(0,0,0,0.35)]"
            >
              <div className="h-full w-[300px]">
                <ProfileRail />
              </div>
            </motion.aside>

            <motion.div
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
              className="min-w-0 flex-1"
            >
              <Stage
                app={stageApp}
                mode={mode}
                maximized={maximized}
                onToggleMax={() => setMaximized((m) => !m)}
                onHome={() => setActiveApp(config.defaultApp)}
              />
            </motion.div>
          </div>

          <Dock
            apps={orderedApps}
            activeId={activeApp}
            onSelect={(id) => setActiveApp(id as AppId)}
          />
        </>
      )}
    </div>
  );
}
