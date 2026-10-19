"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Copy, Check, Heart, MapPin } from "lucide-react";
import {
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  InstagramIcon,
} from "../BrandIcons";
import { site } from "@/lib/data";
import { track } from "@/lib/track";

const EASE = [0.25, 1, 0.5, 1] as const;

const doingWork = [
  "full-stack development",
  "NestJS backends",
  "React interfaces",
  "AWS infrastructure",
  "weird side projects",
];

const doingLife = [
  "back in the hills",
  "hoarding lo-fi playlists",
  "perfecting chai timing",
  "photographing sunsets",
  "being a person",
];

const socialLinks = [
  { name: "GitHub", href: "https://github.com/srxshiv", icon: GithubIcon },
  { name: "LinkedIn", href: "https://linkedin.com/in/srxshiv", icon: LinkedinIcon },
  { name: "Twitter", href: "https://twitter.com/srxshiv", icon: TwitterIcon },
  { name: "Instagram", href: "https://instagram.com/srxshiv", icon: InstagramIcon },
];

/* decorative but honest — the real numbers live in the Experience app */
const vitalsWork = [
  { label: "curiosity", pct: 97, readout: "97%" },
  { label: "ship-it urge", pct: 100, readout: "100%" },
  { label: "caffeine", pct: 23, readout: "refilling…" },
  { label: "imposter mode", pct: 4, readout: "patched" },
];

const vitalsLife = [
  { label: "wholesomeness", pct: 92, readout: "92%" },
  { label: "homesickness", pct: 2, readout: "home now" },
  { label: "playlist game", pct: 100, readout: "elite" },
  { label: "plants alive", pct: 66, readout: "2 of 3" },
];

function RotatingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, [words]);

  return (
    <span className="relative inline-flex overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[index]}
          initial={{ y: "105%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-105%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
          className="inline-block whitespace-nowrap text-foreground"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function PlayfulName({ text }: { text: string }) {
  return (
    <span aria-label={text} role="text">
      {text.split("").map((char, i) =>
        char === " " ? (
          <span key={i}>&nbsp;</span>
        ) : (
          <motion.span
            key={i}
            aria-hidden
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.03 }}
            whileHover={{
              y: -7,
              rotate: i % 2 === 0 ? -6 : 6,
              scale: 1.12,
              transition: { type: "spring", stiffness: 400, damping: 12 },
            }}
            className="inline-block cursor-default will-change-transform"
          >
            {char}
          </motion.span>
        )
      )}
    </span>
  );
}

/** htop for a human. Bars animate in; widths are jokes, the joke is the point. */
function Vitals({ side }: { side: "work" | "life" }) {
  const vitals = side === "work" ? vitalsWork : vitalsLife;
  return (
    <div className="rounded-xl border border-line bg-background p-4 font-mono text-[11.5px] leading-loose">
      <p className="text-faint">
        <span className="text-accent">$</span> vitals --live
        {side === "life" ? " --gentle" : ""}
      </p>
      {vitals.map((vital, i) => (
        <div key={vital.label} className="flex items-center gap-2">
          <span className="w-24 shrink-0 text-muted">{vital.label}</span>
          <span className="relative h-[7px] flex-1 overflow-hidden rounded-full bg-line">
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: `${vital.pct}%` }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.7 + i * 0.15 }}
              className={`absolute inset-y-0 left-0 rounded-full ${
                vital.pct > 90
                  ? "bg-emerald-500"
                  : vital.pct > 50
                    ? "bg-accent"
                    : "bg-amber-400"
              }`}
            />
          </span>
          <span className="w-16 shrink-0 text-right text-[10.5px] text-faint">
            {vital.readout}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * The always-visible identity column — no window can hide it, and it never
 * scrolls: content is sized to fit and the column just breathes with
 * justify-between on short screens.
 */
export function ProfileRail({
  status,
  side = "work",
}: {
  status?: string;
  side?: "work" | "life";
}) {
  const [copied, setCopied] = useState(false);
  const life = side === "life";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      track("copy_email", { from: "rail" });
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable — mailto still works */
    }
  };

  return (
    <div className="flex h-full flex-col justify-between gap-4 overflow-hidden p-6">
      <div className="flex items-center gap-2 self-start rounded-full border border-line bg-background px-3 py-1.5 text-[11px] font-medium tracking-wide text-muted">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-500/60" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        {life
          ? "probably at my desk, humming"
          : status || "Currently building at MedikZo"}
      </div>

      <h1 className="text-[2.5rem] font-medium leading-[1.02] tracking-tighter text-foreground">
        {life ? (
          <>
            <PlayfulName text="still" />
            <br />
            <PlayfulName text="Shiv." />
          </>
        ) : (
          <>
            <PlayfulName text="Hi, I'm" />
            <br />
            <PlayfulName text="Shiv." />
          </>
        )}
      </h1>

      <p className="text-[13.5px] font-light leading-relaxed text-muted">
        {life ? (
          <>
            <span className="text-foreground">Full-time human</span> — currently{" "}
            <RotatingWord words={doingLife} />.
          </>
        ) : (
          <>
            <span className="text-foreground">Computer science enthusiast</span>{" "}
            — doing <RotatingWord words={doingWork} /> right now.
          </>
        )}
      </p>

      {life ? (
        <>
          {/* ── the say-hi kit — no CTA energy, just warmth ── */}
          <div className="flex flex-col gap-2.5 rounded-xl border border-line bg-background p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
              say hi kit
            </p>
            <motion.a
              href={`mailto:${site.email}?subject=hi%20shiv`}
              whileHover={{ scale: 1.02, rotate: -0.5 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
              className="flex items-center justify-center gap-2 rounded-full bg-foreground py-2.5 text-[13px] font-semibold text-background"
            >
              <Heart className="h-3.5 w-3.5" strokeWidth={2} />
              write me something nice
            </motion.a>
            <p className="text-center text-[11px] font-light text-faint">
              or mean. i&apos;ll assume it&apos;s a typo.
            </p>
          </div>
          <Vitals side={side} />
        </>
      ) : (
        <>
          {/* the footnote — the biggest open question wins */}
          <p className="handwritten mt-auto rotate-[-1.5deg] text-sm leading-snug text-faint">
            utmost curiosity: the universe itself — the one system nobody has
            the answers to. yet.
          </p>

          {/* ── slim hire row — still zero hunting for recruiters ── */}
          <div className="flex gap-2">
            <motion.a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("resume_click", { from: "rail" })}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground py-2.5 text-[12.5px] font-semibold text-background"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={2} />
              Resume.pdf
            </motion.a>
            <div className="relative flex-1">
              <motion.button
                onClick={copyEmail}
                title={site.email}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-line py-2.5 text-[12.5px] font-medium text-muted transition-colors duration-300 hover:border-foreground/25 hover:text-foreground"
              >
                {copied ? (
                  <Check
                    className="h-3.5 w-3.5 text-emerald-500"
                    strokeWidth={2}
                  />
                ) : (
                  <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />
                )}
                {copied ? "copied!" : "email me"}
              </motion.button>
              <AnimatePresence>
                {copied && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0, rotate: -4 }}
                    exit={{ opacity: 0 }}
                    className="handwritten absolute -top-6 right-2 text-sm text-emerald-600 dark:text-emerald-400"
                  >
                    now email me ✓
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </>
      )}

      <div className="flex items-center justify-between pt-1">
        {life ? (
          <span className="font-mono text-[11px] text-faint">no KPIs here</span>
        ) : (
          <span
            className="flex items-center gap-1 font-mono text-[11px] text-faint"
            title={`${site.location} · ${site.workMode} · ${site.timezone}`}
          >
            <MapPin className="h-3 w-3" strokeWidth={1.5} />
            {site.location.split(",")[0]} · {site.workMode.toLowerCase()}
          </span>
        )}
        <div className="flex items-center gap-3.5">
          {socialLinks.map((social) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              whileHover={{ y: -3, rotate: -8, scale: 1.15 }}
              transition={{ type: "spring", stiffness: 350, damping: 14 }}
              className="text-faint transition-colors duration-300 hover:text-foreground"
            >
              <social.icon className="h-[16px] w-[16px]" />
            </motion.a>
          ))}
        </div>
      </div>

      {life && (
        <p className="handwritten rotate-[-2deg] text-sm leading-snug text-faint">
          this side has no conversion funnel. on purpose ♡
        </p>
      )}
    </div>
  );
}
