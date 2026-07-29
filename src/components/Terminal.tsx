"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { site, projects } from "@/lib/data";

type Line = { type: "input" | "output" | "accent" | "error"; text: string };

const BANNER: Line[] = [
  { type: "input", text: "whoami" },
  { type: "output", text: "shiv — cs enthusiast, doing full-stack right now" },
  { type: "output", text: "currently shipping healthcare software at medikzo" },
  { type: "accent", text: "type `help` to look around" },
];

/** Chromeless terminal body — lives inside an OS window (or mobile sheet). */
export function TerminalBody({ height = 300 }: { height?: number }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [booted, setBooted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const history = useRef<string[]>([]);
  const historyIndex = useRef(-1);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setLines(BANNER.slice(0, i + 1));
      i += 1;
      if (i >= BANNER.length) {
        clearInterval(id);
        setBooted(true);
      }
    }, 360);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const print = (out: Line[]) => setLines((prev) => [...prev, ...out]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    print([{ type: "input", text: raw }]);
    if (!cmd) return;
    history.current.unshift(raw);
    historyIndex.current = -1;

    const openApp = (id: string) =>
      window.dispatchEvent(new CustomEvent("os-open", { detail: id }));

    switch (cmd) {
      case "help":
        print([
          { type: "output", text: "available commands:" },
          { type: "accent", text: "  letter · work · experience · skills · contact" },
          { type: "output", text: "  whoami        who is this guy" },
          { type: "output", text: "  ls            list the projects" },
          { type: "output", text: "  open <name>   open a live project" },
          { type: "output", text: "  theme         flip light/dark" },
          { type: "output", text: "  resume        grab the pdf" },
          { type: "output", text: "  sudo hire-shiv   (recommended)" },
          { type: "output", text: "  clear · exit" },
        ]);
        break;
      case "whoami":
        print([
          { type: "output", text: "shiv rajput — cs enthusiast, full-stack right now" },
          { type: "output", text: "nestjs · next.js · postgres · aws — end to end" },
        ]);
        break;
      case "ls":
      case "projects":
        print(
          projects.map((p) => ({
            type: "output" as const,
            text: `drwxr-xr-x  ${p.year}  ${p.title.toLowerCase().replace(/\s|\./g, "-")}${p.live ? "  →  open " + p.title.split(".")[0].toLowerCase() : ""}`,
          }))
        );
        break;
      case "about":
      case "letter":
      case "work":
      case "experience":
      case "exp":
      case "skills":
      case "contact": {
        const target =
          cmd === "exp" ? "experience" : cmd === "about" ? "letter" : cmd;
        openApp(target);
        print([{ type: "accent", text: `→ opening ${target}.app` }]);
        break;
      }
      case "theme":
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        print([
          {
            type: "accent",
            text: `→ lights ${resolvedTheme === "dark" ? "on ☀" : "off ☾"}`,
          },
        ]);
        break;
      case "resume":
        window.open(site.resume, "_blank", "noopener");
        print([{ type: "accent", text: "→ opening resume.pdf" }]);
        break;
      case "sudo hire-shiv":
      case "hire-shiv":
      case "sudo hire shiv":
        print([
          { type: "output", text: "[sudo] password for recruiter: ********" },
          { type: "accent", text: "✓ permission granted — opening mail client" },
        ]);
        setTimeout(() => (window.location.href = `mailto:${site.email}`), 700);
        break;
      case "exit":
        print([
          { type: "error", text: "exit? you're inside my portfolio. there is no exit." },
          { type: "output", text: "(the red dot up there sends you home, though)" },
        ]);
        break;
      case "clear":
        setLines([]);
        return;
      case "rm -rf /":
        print([{ type: "error", text: "nice try." }]);
        break;
      default: {
        if (cmd.startsWith("open ")) {
          const name = cmd.slice(5).trim();
          const project = projects.find((p) =>
            p.title.toLowerCase().includes(name)
          );
          if (project?.live) {
            window.open(project.live, "_blank", "noopener");
            print([{ type: "accent", text: `→ opening ${project.title}` }]);
          } else if (project) {
            print([{ type: "error", text: `${project.title} has no live URL — try its source on github` }]);
          } else {
            print([{ type: "error", text: `no project named "${name}" — try \`ls\`` }]);
          }
          break;
        }
        print([
          { type: "error", text: `command not found: ${cmd} — try \`help\`` },
        ]);
      }
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIndex.current + 1, history.current.length - 1);
      if (history.current[next]) {
        historyIndex.current = next;
        setValue(history.current[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyIndex.current - 1;
      historyIndex.current = Math.max(next, -1);
      setValue(next >= 0 ? history.current[next] : "");
    }
  };

  return (
    <div
      ref={bodyRef}
      onClick={() => inputRef.current?.focus()}
      style={{ height }}
      className="no-scrollbar cursor-text overflow-y-auto p-4 font-mono text-[12.5px] leading-relaxed md:text-[13px]"
    >
      {lines.map((line, i) => (
        <div key={i} className="flex gap-2 whitespace-pre-wrap break-words">
          {line.type === "input" && (
            <span className="shrink-0 text-accent">➜ ~</span>
          )}
          <span
            className={
              line.type === "input"
                ? "text-foreground"
                : line.type === "accent"
                  ? "text-accent"
                  : line.type === "error"
                    ? "text-red-400"
                    : "text-muted"
            }
          >
            {line.text}
          </span>
        </div>
      ))}

      {booted && (
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-accent">➜ ~</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal input"
            className="w-full bg-transparent text-foreground outline-none [caret-color:var(--accent)]"
          />
        </div>
      )}
    </div>
  );
}
