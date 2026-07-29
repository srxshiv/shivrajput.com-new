"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  FolderGit2,
  Briefcase,
  Cpu,
  Mail,
  FileDown,
  ArrowUpRight,
  Search,
} from "lucide-react";
import { site, projects } from "@/lib/data";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./BrandIcons";

const EASE = [0.25, 1, 0.5, 1] as const;

type Item = {
  group: string;
  label: string;
  hint?: string;
  icon: React.ElementType;
  action: () => void;
};

/* sections are OS windows — open the app instead of scrolling */
function goTo(id: string) {
  window.dispatchEvent(new CustomEvent("os-open", { detail: id }));
}

function open(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items = useMemo<Item[]>(
    () => [
      { group: "Open app", label: "Cover letter", hint: "README.for-you.md", icon: Home, action: () => goTo("letter") },
      { group: "Open app", label: "Work", hint: "5 case files", icon: FolderGit2, action: () => goTo("work") },
      { group: "Open app", label: "Experience", hint: "medikzo — git log", icon: Briefcase, action: () => goTo("experience") },
      { group: "Open app", label: "Skills", hint: "package.json", icon: Cpu, action: () => goTo("skills") },
      { group: "Open app", label: "Contact", hint: "new-request.http", icon: Mail, action: () => goTo("contact") },
      { group: "Open app", label: "Terminal", hint: "zsh", icon: Cpu, action: () => goTo("terminal") },
      ...projects
        .filter((project) => project.live)
        .map((project) => ({
          group: "Projects",
          label: `Open ${project.title}`,
          hint: project.summary,
          icon: ArrowUpRight,
          action: () => open(project.live!),
        })),
      { group: "Connect", label: "Email me", hint: site.email, icon: Mail, action: () => (window.location.href = `mailto:${site.email}`) },
      { group: "Connect", label: "GitHub", hint: "@srxshiv", icon: GithubIcon, action: () => open("https://github.com/srxshiv") },
      { group: "Connect", label: "LinkedIn", icon: LinkedinIcon, action: () => open("https://linkedin.com/in/srxshiv") },
      { group: "Connect", label: "Twitter", icon: TwitterIcon, action: () => open("https://twitter.com/srxshiv") },
      { group: "Connect", label: "Download resume", icon: FileDown, action: () => open(site.resume) },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.hint?.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q)
    );
  }, [items, query]);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelected(0);
  }, []);

  // global shortcuts + dock trigger
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
      if (e.key === "Escape") close();
    };
    const onToggle = () => setIsOpen((v) => !v);
    window.addEventListener("keydown", onKey);
    window.addEventListener("toggle-cmdk", onToggle);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("toggle-cmdk", onToggle);
    };
  }, [close]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => setSelected(0), [query]);

  // keep selection in view
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${selected}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && filtered[selected]) {
      filtered[selected].action();
      close();
    }
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 px-4 pt-[16vh] backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="glass glow-accent w-full max-w-lg overflow-hidden rounded-2xl"
          >
            {/* input */}
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="h-4 w-4 shrink-0 text-faint" strokeWidth={1.75} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Where to?"
                className="w-full bg-transparent py-4 text-sm text-foreground outline-none placeholder:text-faint"
              />
              <span className="kbd shrink-0">esc</span>
            </div>

            {/* results */}
            <div ref={listRef} className="max-h-[46vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-8 text-center font-mono text-xs text-faint">
                  No results for “{query}”
                </p>
              )}
              {filtered.map((item, i) => {
                const showGroup = item.group !== lastGroup;
                lastGroup = item.group;
                const isSelected = i === selected;
                return (
                  <div key={`${item.group}-${item.label}`}>
                    {showGroup && (
                      <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                        {item.group}
                      </p>
                    )}
                    <button
                      data-index={i}
                      onClick={() => {
                        item.action();
                        close();
                      }}
                      onMouseEnter={() => setSelected(i)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 ${
                        isSelected ? "bg-panel-hover" : ""
                      }`}
                    >
                      <item.icon
                        className={`h-4 w-4 shrink-0 ${
                          isSelected ? "text-accent" : "text-faint"
                        }`}
                      />
                      <span className="flex-1 text-sm text-foreground">
                        {item.label}
                      </span>
                      {item.hint && (
                        <span className="truncate font-mono text-[11px] text-faint">
                          {item.hint}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* footer */}
            <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-[10px] text-faint">
              <span><span className="kbd mr-1.5">↑↓</span>navigate</span>
              <span><span className="kbd mr-1.5">↵</span>select</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
