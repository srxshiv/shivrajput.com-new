"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, animate, useInView } from "framer-motion";
import { Download } from "lucide-react";
import {
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  InstagramIcon,
} from "../BrandIcons";
import { site } from "@/lib/data";

const EASE = [0.25, 1, 0.5, 1] as const;

const doing = [
  "full-stack development",
  "NestJS backends",
  "React interfaces",
  "AWS infrastructure",
  "weird side projects",
];

const socialLinks = [
  { name: "GitHub", href: "https://github.com/srxshiv", icon: GithubIcon },
  { name: "LinkedIn", href: "https://linkedin.com/in/srxshiv", icon: LinkedinIcon },
  { name: "Twitter", href: "https://twitter.com/srxshiv", icon: TwitterIcon },
  { name: "Instagram", href: "https://instagram.com/srxshiv", icon: InstagramIcon },
];

const stats = [
  { value: 229, suffix: "+", label: "API endpoints" },
  { value: 5, suffix: "", label: "products live" },
  { value: 60, suffix: "%", label: "infra costs cut" },
];

function RotatingWord() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % doing.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-flex overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={doing[index]}
          initial={{ y: "105%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-105%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
          className="inline-block whitespace-nowrap text-foreground"
        >
          {doing[index]}
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

function Stat({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      delay,
      ease: [0.25, 1, 0.5, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, delay]);

  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[11px] font-light uppercase tracking-[0.12em] text-faint">
        {label}
      </span>
      <span
        ref={ref}
        className="font-mono text-lg font-medium tracking-tight text-foreground"
      >
        {display}
        <span className="text-accent">{suffix}</span>
      </span>
    </div>
  );
}

/** The always-visible identity column — no window can hide it. */
export function ProfileRail() {
  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-6">
      <div className="flex items-center gap-2 self-start rounded-full border border-line bg-background px-3 py-1.5 text-[11px] font-medium tracking-wide text-muted">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-500/60" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        Currently building at Medikzo
      </div>

      <h1 className="text-[2.6rem] font-medium leading-[1.02] tracking-tighter text-foreground">
        <PlayfulName text="Hi, I'm" />
        <br />
        <PlayfulName text="Shiv." />
      </h1>

      <p className="text-[13.5px] font-light leading-relaxed text-muted">
        <span className="text-foreground">Computer science enthusiast</span> —
        doing <RotatingWord /> right now.
      </p>

      <div className="flex flex-col gap-2.5 rounded-xl border border-line bg-background p-4">
        {stats.map((stat, i) => (
          <Stat key={stat.label} {...stat} delay={0.6 + i * 0.15} />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <motion.a
          href={site.resume}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 16 }}
          className="flex items-center gap-2 rounded-full border border-line bg-background px-4 py-2 text-[12px] font-medium text-muted transition-colors duration-300 hover:border-foreground/25 hover:text-foreground"
        >
          <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
          Resume
        </motion.a>
        <div className="flex items-center gap-4">
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
              <social.icon className="h-[17px] w-[17px]" />
            </motion.a>
          ))}
        </div>
      </div>

      <p className="handwritten mt-auto rotate-[-2deg] text-base text-faint">
        the dock below switches apps — nothing ever hides ↓
      </p>
    </div>
  );
}
