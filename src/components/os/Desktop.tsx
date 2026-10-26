"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileHeart,
  FolderGit2,
  Briefcase,
  Braces,
  Mail,
  Terminal as TerminalIcon,
  FileText,
  ChevronLeft,
  PenLine,
  StickyNote,
  Clapperboard,
  BookHeart,
  Camera,
  Route,
  Trees,
} from "lucide-react";
import { MenuBar, type Side } from "./MenuBar";
import { Dock, type DockApp } from "./Dock";
import { ProfileRail } from "./ProfileRail";
import { DotGrid } from "../DotGrid";
import { VibeLayer } from "./Vibe";
import { TerminalBody } from "../Terminal";
import { CoverLetter } from "../CoverLetter";
import { WorkContent } from "../ProjectsRail";
import { ExperienceContent } from "../Experience";
import { SkillsContent } from "../Skills";
import { ContactContent } from "../Contact";
import { BlogApp } from "../apps/BlogApp";
import { NotesApp } from "../apps/NotesApp";
import { VideosApp } from "../apps/VideosApp";
import { StoryApp } from "../apps/StoryApp";
import { MemoriesApp } from "../apps/MemoriesApp";
import { LifelineApp } from "../apps/LifelineApp";
import { HobbiesApp } from "../apps/HobbiesApp";
import { Dobby } from "../Dobby";
import { site } from "@/lib/data";
import { track } from "@/lib/track";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/settings-shared";

const EASE = [0.25, 1, 0.5, 1] as const;

export type AppId =
  | "letter"
  | "work"
  | "experience"
  | "skills"
  | "videos"
  | "contact"
  | "terminal"
  | "blog"
  | "notes"
  | "story"
  | "memories"
  | "lifeline"
  | "hobbies";

type AppDef = {
  id: AppId;
  label: string;
  title: string;
  icon: React.ElementType;
  render: () => React.ReactNode;
};

const APPS: AppDef[] = [
  {
    id: "letter",
    label: "Cover letter",
    title: "a letter — for you",
    icon: FileHeart,
    render: () => <CoverLetter />,
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
    title: "experience — full-stack engineer @ medikzo",
    icon: Briefcase,
    render: () => <ExperienceContent />,
  },
  {
    id: "skills",
    label: "skills.json",
    title: "shiv/skills.json",
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
  {
    id: "blog",
    label: "Blog",
    title: "blog — things i wrote",
    icon: PenLine,
    render: () => <BlogApp />,
  },
  {
    id: "notes",
    label: "Notes",
    title: "notes.wall — left by visitors",
    icon: StickyNote,
    render: () => <NotesApp />,
  },
  {
    id: "videos",
    label: "Videos",
    title: "videos.app — occasionally on camera",
    icon: Clapperboard,
    render: () => <VideosApp />,
  },
  /* ── the life partition ── */
  {
    id: "story",
    label: "Story",
    title: "hello-human.md",
    icon: BookHeart,
    render: () => <StoryApp />,
  },
  {
    id: "memories",
    label: "Memories",
    title: "memory-board — drag things",
    icon: Camera,
    render: () => <MemoriesApp />,
  },
  {
    id: "lifeline",
    label: "Timeline",
    title: "the-anti-resume.svg",
    icon: Route,
    render: () => <LifelineApp />,
  },
  {
    id: "hobbies",
    label: "Skill tree",
    title: "skill-tree.rpg — build: chaotic good",
    icon: Trees,
    render: () => <HobbiesApp />,
  },
];

/* each side has one fixed order — everyone sees the same OS */
const WORK_APPS: AppId[] = [
  "work",
  "experience",
  "letter",
  "skills",
  "terminal",
  "contact",
  "notes",
  "blog",
  "videos",
];
const WORK_DEFAULT: AppId = "work";
const LIFE_APPS: AppId[] = ["story", "memories", "lifeline", "hobbies", "notes"];
const LIFE_DEFAULT: AppId = "story";

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
  maximized,
  onToggleMax,
  onHome,
}: {
  app: AppDef;
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
            {app.render()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────── mobile home screen ───────────────────── */

function MobileOS({
  settings,
  side,
  onSwitchSide,
}: {
  settings: SiteSettings;
  side: Side;
  onSwitchSide: (side: Side) => void;
}) {
  const [openApp, setOpenApp] = useState<AppId | null>(null);
  const app = APPS.find((a) => a.id === openApp);

  useEffect(() => {
    const onOpen = (e: Event) =>
      setOpenApp((e as CustomEvent<AppId>).detail ?? null);
    window.addEventListener("os-open", onOpen);
    return () => window.removeEventListener("os-open", onOpen);
  }, []);

  const life = side === "life";
  const ordered = (life ? LIFE_APPS : WORK_APPS)
    .filter((id) => settings.dock[id] !== false)
    .map((id) => APPS.find((a) => a.id === id)!);

  return (
    <div className="relative flex h-svh flex-col overflow-hidden">
      <DotGrid />

      <div className="relative z-10 px-7 pt-16">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-faint">
            ❖ ShivOS · {life ? "life side" : "work side"}
          </p>
          <button
            onClick={() => onSwitchSide(life ? "work" : "life")}
            className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[10px] text-muted"
          >
            {life ? "→ work" : "→ life"}
          </button>
        </div>
        <h1 className="mt-3 text-5xl font-medium tracking-tighter text-foreground">
          {life ? "still Shiv." : "Hi, I'm Shiv."}
        </h1>
        <p className="mt-3 text-sm font-light leading-relaxed text-muted">
          {life ? (
            <>
              <span className="text-foreground">Full-time human</span> — this
              side has no KPIs. Tap around.
            </>
          ) : (
            <>
              <span className="text-foreground">CS enthusiast</span> — doing
              full-stack development right now. Tap an app.
            </>
          )}
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
            onClick={() => {
              setOpenApp(appDef.id);
              track("app_open", { app: appDef.id, surface: "mobile" });
            }}
            className="flex flex-col items-center gap-2"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-surface text-muted shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
              <appDef.icon className="h-6 w-6" strokeWidth={1.5} />
            </span>
            <span className="text-[10px] font-medium text-muted">
              {appDef.label}
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
          onClick={() => track("resume_click", { from: "mobile_home" })}
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
              {app.render()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dobby />
    </div>
  );
}

/* ────────────────────────── the workspace ─────────────────────── */

const SIDE_KEY = "shivos-side";

export function Desktop() {
  const [booted, setBooted] = useState(false);
  const [activeApp, setActiveApp] = useState<AppId>(WORK_DEFAULT);
  const [maximized, setMaximized] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [side, setSide] = useState<Side>("work");
  const [reveal, setReveal] = useState<Side | null>(null);
  const [vibe, setVibe] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  // the warm theme is a class on <html>, same mechanism as dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("human", side === "life");
    sessionStorage.setItem(SIDE_KEY, side);
    if (side === "work") setVibe(false);
  }, [side]);

  const switchSide = (target: Side) => {
    if (target === side || reveal) return;
    track("side_switch", { to: target });
    setReveal(target);
    // swap worlds mid-reveal, while the wave covers the screen
    setTimeout(() => {
      setSide(target);
      setActiveApp(target === "life" ? LIFE_DEFAULT : WORK_DEFAULT);
    }, 340);
    setTimeout(() => setReveal(null), 900);
  };

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // dock visibility, status line — admin-configurable
  useEffect(() => {
    let alive = true;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((json) => alive && json.settings && setSettings(json.settings))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // returning to the life side picks up where they left off
  useEffect(() => {
    if (sessionStorage.getItem(SIDE_KEY) === "life") {
      setSide("life");
      setActiveApp(LIFE_DEFAULT);
    }
  }, []);

  // terminal + palette open apps from anywhere — crossing sides if needed
  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<string>).detail as AppId;
      if (!APPS.some((a) => a.id === id)) return;
      track("app_open", { app: id, surface: "shortcut" });
      const isLifeApp = LIFE_APPS.includes(id) && id !== "notes";
      if (isLifeApp && side !== "life") switchSide("life");
      else if (!isLifeApp && side !== "work" && id !== "notes")
        switchSide("work");
      setActiveApp(id);
    };
    const onSide = (e: Event) => {
      const target = (e as CustomEvent<Side>).detail;
      if (target === "work" || target === "life") switchSide(target);
    };
    window.addEventListener("os-open", onOpen);
    window.addEventListener("os-side", onSide);
    return () => {
      window.removeEventListener("os-open", onOpen);
      window.removeEventListener("os-side", onSide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [side, reveal]);

  if (isDesktop === null) return <div className="h-svh" />;

  if (!isDesktop) {
    return (
      <>
        <AnimatePresence>
          {!booted && <BootScreen onDone={() => setBooted(true)} />}
        </AnimatePresence>
        {booted && (
          <MobileOS
            settings={settings}
            side={side}
            onSwitchSide={(target) => {
              setSide(target);
              track("side_switch", { to: target, surface: "mobile" });
            }}
          />
        )}
      </>
    );
  }

  const baseOrder = side === "life" ? LIFE_APPS : WORK_APPS;
  const defaultApp = side === "life" ? LIFE_DEFAULT : WORK_DEFAULT;
  const visibleOrder = baseOrder.filter((id) => settings.dock[id] !== false);
  const orderedApps: DockApp[] = visibleOrder.map((id) => {
    const app = APPS.find((a) => a.id === id)!;
    return { id: app.id, label: app.label, icon: app.icon };
  });
  // a hidden app can't be the stage — fall back to the first visible one
  const homeApp = visibleOrder.includes(defaultApp)
    ? defaultApp
    : (visibleOrder[0] ?? defaultApp);
  const stageApp =
    APPS.find(
      (a) => a.id === (visibleOrder.includes(activeApp) ? activeApp : homeApp)
    ) ?? APPS[0];

  return (
    <div className="relative h-svh overflow-hidden">
      <AnimatePresence>
        {!booted && <BootScreen onDone={() => setBooted(true)} />}
      </AnimatePresence>

      {/* the partition wave — a warm (or cool) circle swallows the screen */}
      <AnimatePresence>
        {reveal && (
          <motion.div
            initial={{ clipPath: "circle(0% at 50% 24px)" }}
            animate={{ clipPath: "circle(150% at 50% 24px)" }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            transition={{ duration: 0.55, ease: EASE }}
            className="pointer-events-none fixed inset-0 z-[95] flex items-center justify-center"
            style={{
              background: reveal === "life" ? "#e8d9bd" : "#d5dbe3",
            }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="handwritten text-3xl text-[#4a3b2c]"
            >
              {reveal === "life" ? "switching to human…" : "back to work…"}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {booted && (
        <>
          <MenuBar
            side={side}
            onSwitchSide={switchSide}
            vibe={vibe}
            onToggleVibe={() => {
              setVibe((v) => !v);
              track("vibe_toggle", { on: !vibe });
            }}
          />

          {/* wallpaper — the quiet dot grid; the galaxy lives in the rail */}
          <div className="absolute inset-0" aria-hidden>
            <DotGrid />
          </div>

          <VibeLayer active={vibe && side === "life"} />

          {/* the tiling — rail + stage, side by side, never overlapping;
              bottom clears the dock with its always-on labels */}
          <div className="absolute inset-x-4 bottom-28 top-14 flex gap-4">
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
                <ProfileRail status={settings.status} side={side} />
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
                maximized={maximized}
                onToggleMax={() => setMaximized((m) => !m)}
                onHome={() => setActiveApp(homeApp)}
              />
            </motion.div>
          </div>

          <Dock
            apps={orderedApps}
            activeId={stageApp.id}
            onSelect={(id) => {
              setActiveApp(id as AppId);
              track("app_open", { app: id, surface: "dock" });
            }}
          />

          <Dobby />
        </>
      )}
    </div>
  );
}
