"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Command, BatteryFull, Wifi, RefreshCcw } from "lucide-react";
import { ThemeToggle } from "../theme";
import type { Mode } from "./Gate";

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

/* site-level navigation — Blog and more pages slot in here later */
const siteNav = [
  { label: "Home", active: true, soon: false },
  { label: "Blog", active: false, soon: true },
];

export function MenuBar({
  mode,
  onSwitchMode,
}: {
  mode: Mode;
  onSwitchMode: () => void;
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
      </div>

      <div className="flex items-center gap-4">
        {/* the mode chip — break character, invite a switch */}
        <button
          onClick={onSwitchMode}
          className="group flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-[11px] transition-colors duration-300 hover:border-foreground/25 hover:text-foreground"
        >
          viewing as: <span className="text-accent">{mode}</span>
          <RefreshCcw className="h-3 w-3 transition-transform duration-500 group-hover:rotate-180" strokeWidth={1.5} />
        </button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("toggle-cmdk"))}
          aria-label="Open command palette"
          className="flex items-center gap-1.5 font-mono text-[11px] transition-colors hover:text-foreground"
        >
          <Command className="h-3.5 w-3.5" strokeWidth={1.5} />K
        </button>
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
