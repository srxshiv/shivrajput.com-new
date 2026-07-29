"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { FileText } from "lucide-react";
import { site } from "@/lib/data";

export type DockApp = {
  id: string;
  label: string;
  icon: React.ElementType;
};

function DockIcon({
  mouseX,
  label,
  active,
  onClick,
  children,
}: {
  mouseX: MotionValue<number>;
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return 999;
    return val - bounds.x - bounds.width / 2;
  });

  const size = useSpring(useTransform(distance, [-110, 0, 110], [44, 68, 44]), {
    stiffness: 260,
    damping: 18,
  });
  const iconScale = useSpring(
    useTransform(distance, [-110, 0, 110], [1, 1.35, 1]),
    { stiffness: 260, damping: 18 }
  );

  return (
    <div className="group relative flex flex-col items-center">
      <span className="glass pointer-events-none absolute -top-9 whitespace-nowrap rounded-md px-2.5 py-1 font-mono text-[11px] text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {label}
      </span>
      <motion.button
        ref={ref}
        onClick={onClick}
        aria-label={label}
        aria-pressed={active}
        style={{ width: size, height: size }}
        whileTap={{ scale: 0.85 }}
        className={`flex items-center justify-center rounded-2xl border bg-surface shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-colors duration-300 dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)] ${
          active
            ? "border-foreground/35 text-foreground"
            : "border-line text-muted hover:border-foreground/25"
        }`}
      >
        <motion.span style={{ scale: iconScale }}>{children}</motion.span>
      </motion.button>
      {/* active dot */}
      <span
        className={`mt-1 h-1 w-1 rounded-full bg-foreground transition-opacity duration-300 ${
          active ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />
    </div>
  );
}

/** The dock is a stage switcher now — one app on stage, nothing overlaps. */
export function Dock({
  apps,
  activeId,
  onSelect,
}: {
  apps: DockApp[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      initial={{ y: 90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.4 }}
      className="pointer-events-auto fixed bottom-3 left-1/2 z-[60] -translate-x-1/2 select-none"
    >
      <div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="glass flex items-end gap-2 rounded-3xl px-3 pb-1.5 pt-2 shadow-[0_16px_48px_rgba(0,0,0,0.14)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
      >
        {apps.map((app) => (
          <DockIcon
            key={app.id}
            mouseX={mouseX}
            label={app.label}
            active={activeId === app.id}
            onClick={() => onSelect(app.id)}
          >
            <app.icon className="h-[22px] w-[22px]" strokeWidth={1.6} />
          </DockIcon>
        ))}

        <span className="mx-1 mb-3 h-8 w-px self-end bg-line" aria-hidden />

        {/* resume — the only external one */}
        <DockIcon
          mouseX={mouseX}
          label="resume.pdf"
          onClick={() => window.open(site.resume, "_blank", "noopener")}
        >
          <FileText className="h-[22px] w-[22px]" strokeWidth={1.6} />
        </DockIcon>
      </div>
    </motion.div>
  );
}
