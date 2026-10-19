"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { hobbyTree, type HobbyNode } from "@/lib/human-data";

const EASE = [0.25, 1, 0.5, 1] as const;

/* map canvas is larger than the viewport — pan around it like a world map */
const MAP_W = 900;
const MAP_H = 620;

function nodePos(node: HobbyNode) {
  return { x: (node.x / 100) * MAP_W, y: (node.y / 100) * MAP_H };
}

/** RPG skill tree — pan the map, hover a node, watch the branch light up. */
export function HobbiesApp() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const center = nodePos(hobbyTree.center);
  const all = [hobbyTree.center, ...hobbyTree.nodes];

  return (
    <div className="flex h-full min-h-[480px] flex-col">
      <div className="flex items-center justify-between px-6 pt-5">
        <p className="handwritten rotate-[-1.5deg] text-xl text-faint">
          the skill tree — drag the map, hover the nodes
        </p>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
          build: chaotic good
        </span>
      </div>

      <div
        ref={viewportRef}
        className="relative mx-4 mb-4 mt-2 flex-1 overflow-hidden rounded-2xl border border-line bg-background/60"
      >
        <motion.div
          drag
          dragConstraints={viewportRef}
          dragElastic={0.08}
          dragMomentum
          dragTransition={{ power: 0.25, timeConstant: 160 }}
          initial={{ x: -(MAP_W / 2) + 320, y: -(MAP_H / 2) + 220 }}
          style={{ width: MAP_W, height: MAP_H }}
          className="absolute cursor-grab touch-none active:cursor-grabbing"
        >
          {/* branches */}
          <svg
            width={MAP_W}
            height={MAP_H}
            className="pointer-events-none absolute inset-0"
            aria-hidden
          >
            {hobbyTree.nodes.map((node) => {
              const p = nodePos(node);
              const lit = hovered === node.id || hovered === "curiosity";
              const midX = (center.x + p.x) / 2;
              return (
                <path
                  key={node.id}
                  d={`M ${center.x} ${center.y} Q ${midX} ${p.y} ${p.x} ${p.y}`}
                  fill="none"
                  stroke={lit ? "var(--accent)" : "var(--line)"}
                  strokeWidth={lit ? 2.5 : 1.5}
                  strokeDasharray={lit ? "none" : "4 6"}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* nodes */}
          {all.map((node, i) => {
            const p = nodePos(node);
            const isCenter = node.id === hobbyTree.center.id;
            const lit = hovered === node.id;
            return (
              <motion.button
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                  delay: 0.15 + i * 0.08,
                }}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(node.id)}
                onBlur={() => setHovered(null)}
                style={{ left: p.x, top: p.y }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                <motion.span
                  animate={
                    lit
                      ? { scale: 1.12, boxShadow: "0 0 28px var(--glow)" }
                      : { scale: 1, boxShadow: "0 0 0px rgba(0,0,0,0)" }
                  }
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className={`flex flex-col items-center gap-0.5 rounded-2xl border px-4 py-2.5 ${
                    isCenter
                      ? "border-accent/60 bg-surface"
                      : lit
                        ? "border-accent/50 bg-surface"
                        : "border-line bg-surface/90"
                  }`}
                >
                  <span
                    className={`whitespace-nowrap text-[13px] font-medium tracking-tight ${
                      isCenter ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {node.label}
                  </span>
                  <span className="font-mono text-[9.5px] uppercase tracking-wider text-faint">
                    lvl {node.level}
                  </span>
                </motion.span>

                {/* tooltip */}
                <AnimatePresence>
                  {lit && (
                    <motion.span
                      initial={{ opacity: 0, y: 6, rotate: 0 }}
                      animate={{ opacity: 1, y: 0, rotate: -1.5 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="handwritten pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-48 -translate-x-1/2 rounded-xl border border-line bg-background px-3 py-2 text-center text-[14px] leading-snug text-muted shadow-[0_8px_28px_rgba(60,40,20,0.15)]"
                    >
                      {node.note}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </motion.div>

        <span className="pointer-events-none absolute bottom-3 right-4 font-mono text-[10px] text-faint">
          respec unavailable — levels only go up
        </span>
      </div>
    </div>
  );
}
