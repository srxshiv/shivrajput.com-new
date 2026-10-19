"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Command,
  BatteryFull,
  Wifi,
  Briefcase,
  Heart,
  CloudRain,
} from "lucide-react";
import { ThemeToggle } from "../theme";

export type Side = "work" | "life";

/** Live visitor count — everyone can see who else is wandering ShivOS. */
function LiveVisitors() {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    const poll = () =>
      fetch("/api/live")
        .then((r) => r.json())
        .then((json) => alive && setActive(json.active))
        .catch(() => {});
    poll();
    const id = setInterval(poll, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  if (typeof active !== "number" || active < 1) return null;

  return (
    <span
      className="flex items-center gap-1.5 font-mono text-[11px]"
      title={`${active} ${active === 1 ? "soul" : "souls"} currently wandering ShivOS (you included)`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-500/60" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      {active} online
    </span>
  );
}

function Clock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        })
      );
      // re-align to the next real second instead of drifting on a fixed interval
      timeout = setTimeout(tick, 1000 - now.getMilliseconds());
    };

    tick();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <span className="hidden font-mono text-[11px] tabular-nums sm:inline">
      {time} IST
    </span>
  );
}

/** The partition switch — one person, two file systems. */
function SideSwitch({
  side,
  onSwitchSide,
}: {
  side: Side;
  onSwitchSide: (side: Side) => void;
}) {
  return (
    <div className="relative flex items-center rounded-full border border-line bg-surface p-0.5">
      {(
        [
          { id: "work" as Side, label: "work", icon: Briefcase },
          { id: "life" as Side, label: "life", icon: Heart },
        ]
      ).map((option) => {
        const active = side === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onSwitchSide(option.id)}
            aria-pressed={active}
            aria-label={`Switch to the ${option.label} side`}
            className="relative flex items-center gap-1.5 rounded-full px-3 py-1"
          >
            {active && (
              <motion.span
                layoutId="side-pill"
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <option.icon
              className={`relative z-10 h-3 w-3 ${
                active ? "text-background" : "text-faint"
              }`}
              strokeWidth={2}
            />
            <span
              className={`relative z-10 text-[11px] font-medium ${
                active ? "text-background" : "text-faint"
              }`}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* site-level navigation — Blog and other pages slot in here later */
const siteNav = [{ label: "Home", active: true, soon: false }];

export function MenuBar({
  side,
  onSwitchSide,
  vibe,
  onToggleVibe,
}: {
  side: Side;
  onSwitchSide: (side: Side) => void;
  vibe: boolean;
  onToggleVibe: () => void;
}) {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 26, delay: 0.2 }}
      className="glass fixed inset-x-0 top-0 z-[60] flex h-11 select-none items-center justify-between border-x-0 border-t-0 px-4 text-muted"
    >
      <div className="flex items-center gap-4">
        <span className="font-mono text-[12px] font-semibold text-foreground">
          ❖ ShivOS
        </span>
        <nav className="flex items-center gap-1">
          {siteNav.map((item) =>
            item.soon ? (
              <span
                key={item.label}
                title="Coming soon"
                className="flex cursor-default items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium text-faint"
              >
                {item.label}
                <span className="rounded-full border border-line bg-surface px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider">
                  soon
                </span>
              </span>
            ) : (
              <span
                key={item.label}
                className="rounded-full bg-panel-hover px-3 py-1 text-[12px] font-medium text-foreground"
              >
                {item.label}
              </span>
            )
          )}
        </nav>
        <SideSwitch side={side} onSwitchSide={onSwitchSide} />
      </div>

      <div className="flex items-center gap-4">
        {side === "life" && (
          /* the vibe check — rain, dim lights, synthesized lo-fi weather */
          <button
            onClick={onToggleVibe}
            aria-pressed={vibe}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] transition-colors duration-300 ${
              vibe
                ? "border-accent/50 bg-surface text-accent"
                : "border-line bg-surface hover:border-foreground/25 hover:text-foreground"
            }`}
          >
            <CloudRain className="h-3 w-3" strokeWidth={1.5} />
            {vibe ? "raining" : "vibe check"}
          </button>
        )}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("toggle-cmdk"))}
          aria-label="Open command palette"
          className="flex items-center gap-1.5 font-mono text-[11px] transition-colors hover:text-foreground"
        >
          <Command className="h-3.5 w-3.5" strokeWidth={1.5} />K
        </button>
        <LiveVisitors />
        <Wifi className="hidden h-3.5 w-3.5 sm:block" strokeWidth={1.5} aria-hidden />
        <span
          className="hidden items-center gap-1 font-mono text-[11px] sm:flex"
          title="Powered by coffee"
        >
          <BatteryFull className="h-4 w-4" strokeWidth={1.5} /> ∞
        </span>
        <Clock />
        <div className="-mr-2 scale-90">
          <ThemeToggle />
        </div>
      </div>
    </motion.div>
  );
}
