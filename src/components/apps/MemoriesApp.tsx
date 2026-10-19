"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const EASE = [0.25, 1, 0.5, 1] as const;

type Memory = {
  id: string;
  imageUrl: string | null;
  caption: string;
  rotation: number;
};

/* deterministic scatter — stable between renders, no hydration drama */
const SPOTS = [
  { x: 6, y: 8 }, { x: 46, y: 4 }, { x: 74, y: 14 },
  { x: 16, y: 44 }, { x: 56, y: 38 }, { x: 80, y: 52 },
  { x: 8, y: 72 }, { x: 38, y: 66 }, { x: 66, y: 76 },
  { x: 28, y: 22 }, { x: 88, y: 32 }, { x: 48, y: 84 },
];

function Polaroid({
  memory,
  index,
  constraintsRef,
  onGrab,
  z,
}: {
  memory: Memory;
  index: number;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
  onGrab: () => number;
  z: number;
}) {
  const spot = SPOTS[index % SPOTS.length];
  const [zIndex, setZIndex] = useState(z);
  const rotate = memory.rotation || ((index % 5) - 2) * 3.5;

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.12}
      dragMomentum
      dragTransition={{ power: 0.3, timeConstant: 180 }}
      onDragStart={() => setZIndex(onGrab())}
      initial={{ opacity: 0, scale: 0.7, rotate: rotate * 2 }}
      animate={{ opacity: 1, scale: 1, rotate }}
      whileHover={{ scale: 1.04 }}
      whileDrag={{ scale: 1.08, rotate: rotate * 0.4 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.15 + index * 0.07 }}
      style={{ left: `${spot.x}%`, top: `${spot.y}%`, zIndex }}
      className="absolute w-[168px] cursor-grab touch-none select-none active:cursor-grabbing md:w-[196px]"
    >
      <div className="rounded-[4px] border border-line/60 bg-[#fffdf7] p-2.5 pb-3 shadow-[0_10px_30px_rgba(60,40,20,0.18)] dark:bg-[#f4ecdd]">
        <div className="relative aspect-square w-full overflow-hidden rounded-[2px] bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100">
          {memory.imageUrl ? (
            <Image
              src={memory.imageUrl}
              alt={memory.caption}
              fill
              sizes="196px"
              draggable={false}
              className="object-cover"
            />
          ) : (
            /* caption-only memories render as a written-on photo slot */
            <div className="flex h-full items-center justify-center p-3">
              <p className="handwritten rotate-[-2deg] text-center text-[15px] leading-snug text-[#6b5138]">
                {memory.caption}
              </p>
            </div>
          )}
        </div>
        <p className="handwritten mt-2 truncate text-center text-[13px] text-[#7a6248]">
          {memory.imageUrl ? memory.caption : "· · ·"}
        </p>
      </div>
    </motion.div>
  );
}

/** A scattered desk of draggable polaroids. Toss them. They don't mind. */
export function MemoriesApp() {
  const [memories, setMemories] = useState<Memory[] | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const topZ = useRef(10);

  useEffect(() => {
    let alive = true;
    fetch("/api/memories")
      .then((r) => r.json())
      .then((json) => alive && setMemories(json.memories ?? []))
      .catch(() => alive && setMemories([]));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="flex h-full min-h-[480px] flex-col">
      <div className="flex items-center justify-between px-6 pt-5">
        <p className="handwritten rotate-[-1.5deg] text-xl text-faint">
          grab one. toss it. rearrange my life.
        </p>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
          {memories?.length ?? "…"} pinned
        </span>
      </div>

      <div ref={boardRef} className="relative mx-4 mb-4 mt-2 flex-1">
        {memories === null && (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-faint" />
          </div>
        )}

        {memories?.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <p className="handwritten rotate-[-2deg] text-2xl text-faint">
              no memories pinned yet
            </p>
            <p className="text-[12px] font-light text-faint">
              shiv needs to raid his camera roll. soon.
            </p>
          </div>
        )}

        {memories?.map((memory, i) => (
          <Polaroid
            key={memory.id}
            memory={memory}
            index={i}
            constraintsRef={boardRef}
            z={10 + i}
            onGrab={() => {
              topZ.current += 1;
              return topZ.current;
            }}
          />
        ))}
      </div>
    </div>
  );
}
