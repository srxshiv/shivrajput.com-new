"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Copy, Check, Send } from "lucide-react";
import { site, socials } from "@/lib/data";

const EASE = [0.25, 1, 0.5, 1] as const;

export function ContactContent() {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable — the mailto button still works */
    }
  };

  const sendRequest = () => {
    setSent(true);
    setTimeout(() => (window.location.href = `mailto:${site.email}`), 900);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* ── the human part ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="flex flex-col items-start text-left"
      >
        <h2 className="text-3xl font-medium tracking-tighter text-foreground">
          Say hi.
        </h2>
        <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-muted">
          Interesting problem? Good team? Weird idea? Email is fastest — or
          press <span className="kbd">⌘K</span> from anywhere.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <motion.a
            href={`mailto:${site.email}`}
            whileHover={{ scale: 1.05, rotate: -1.5 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 16 }}
            className="inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-4 text-sm font-semibold tracking-wide text-background"
          >
            {site.email}
            <ArrowUpRight className="h-4 w-4" />
          </motion.a>

          <div className="relative">
            <motion.button
              onClick={copyEmail}
              aria-label="Copy email address"
              whileHover={{ scale: 1.1, rotate: 4 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-foreground/30 hover:text-foreground"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  >
                    <Check className="h-4 w-4 text-emerald-500" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  >
                    <Copy className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, y: 4, rotate: 0 }}
                  animate={{ opacity: 1, y: 0, rotate: -6 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="handwritten absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-lg text-emerald-600 dark:text-emerald-400"
                >
                  copied ✓
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-6">
          {socials.map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3, rotate: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 16 }}
              className="text-sm font-light text-faint transition-colors duration-300 hover:text-foreground"
            >
              {social.label}
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* ── the request ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24, rotate: 1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
        className="w-full"
      >
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_16px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_60px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="font-mono text-[11px] text-faint">
              new-request.http
            </span>
            <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-faint">
              draft
            </span>
          </div>

          <div className="p-5 font-mono text-[12.5px] leading-[1.9] md:text-[13.5px]">
            <p>
              <span className="text-accent">POST</span>{" "}
              <span className="text-foreground">/inbox</span>{" "}
              <span className="text-faint">HTTP/1.1</span>
            </p>
            <p className="text-muted">
              Host: <span className="text-foreground/80">shivrajput.com</span>
            </p>
            <p className="text-muted">
              Content-Type:{" "}
              <span className="text-foreground/80">application/json</span>
            </p>
            <p className="mt-3 text-muted">{"{"}</p>
            <p className="pl-5">
              <span className="text-accent">&quot;from&quot;</span>
              <span className="text-muted">: </span>
              <span className="text-emerald-600 dark:text-emerald-400">
                &quot;you&quot;
              </span>
              <span className="text-muted">,</span>
            </p>
            <p className="pl-5">
              <span className="text-accent">&quot;about&quot;</span>
              <span className="text-muted">: </span>
              <span className="text-emerald-600 dark:text-emerald-400">
                &quot;something worth building&quot;
              </span>
            </p>
            <p className="text-muted">{"}"}</p>

            {/* response */}
            <AnimatePresence>
              {sent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 border-t border-dashed border-line pt-4">
                    <p>
                      <span className="text-faint">HTTP/1.1</span>{" "}
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        201 Created
                      </span>
                    </p>
                    <p className="text-muted">
                      X-Reply-Guaranteed:{" "}
                      <span className="text-foreground/80">true</span>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-line p-4">
            <motion.button
              onClick={sendRequest}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 18 }}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-foreground py-3.5 text-sm font-semibold text-background"
            >
              <Send className="h-4 w-4" />
              {sent ? "Sent — opening your mail app…" : "Send request"}
            </motion.button>
          </div>
        </div>
        <p className="handwritten mt-4 rotate-[1.5deg] text-center text-lg">
          i actually reply — 201, not 202
        </p>
      </motion.div>
    </div>
  );
}
