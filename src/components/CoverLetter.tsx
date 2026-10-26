"use client";

import { motion } from "framer-motion";
import { Check, ArrowUpRight, Download } from "lucide-react";
import { site, letter } from "@/lib/data";

const EASE = [0.25, 1, 0.5, 1] as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/** `**bold**` → heavier ink. */
function Ink({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 ? <strong key={i}>{part}</strong> : part
      )}
    </>
  );
}

/** The cover letter — a handwritten page that fills the whole window. */
export function CoverLetter() {
  return (
    <div className="@container flex min-h-full flex-col">
      <motion.article
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="letter-paper flex-1"
      >
        <motion.p variants={fadeUp}>{letter.greeting}</motion.p>

        {letter.paragraphs.map((paragraph, i) => (
          <motion.p key={i} variants={fadeUp}>
            <Ink text={paragraph} />
          </motion.p>
        ))}

        <motion.div variants={fadeUp}>
          <p>{letter.signoff}</p>
          <p>
            <span className="handwritten inline-block -rotate-3 text-[1.15em] leading-none text-foreground!">
              {letter.signature}
            </span>
            <span className="handwritten ml-5 text-[0.55em] leading-none text-faint">
              (yes, i wrote this. the site just renders it)
            </span>
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="text-muted">
          <p>{letter.postscript.lead}</p>
          <ul>
            {letter.postscript.items.map((item) => (
              <li key={item} className="flex items-baseline gap-2.5">
                <Check
                  className="h-[0.7em] w-[0.7em] shrink-0 -rotate-6 text-accent"
                  strokeWidth={3}
                />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center gap-3 font-sans leading-normal"
        >
          <motion.a
            href={`mailto:${site.email}`}
            whileHover={{ scale: 1.04, rotate: -1 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 16 }}
            className="flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-semibold text-background"
          >
            {site.email}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </motion.a>
          <motion.a
            href={site.resume}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, rotate: 1 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 16 }}
            className="flex items-center gap-2 rounded-full border border-line bg-background px-5 py-2.5 text-[13px] font-medium text-muted transition-colors duration-300 hover:border-foreground/30 hover:text-foreground"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
            resume.pdf
          </motion.a>
        </motion.div>
      </motion.article>
    </div>
  );
}
