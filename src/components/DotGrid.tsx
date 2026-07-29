"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive dot grid — dots ease away from the cursor and spring back.
 * Pure canvas + rAF, pauses when offscreen, disabled for touch devices
 * and prefers-reduced-motion. Cheap: one layer, ~400 dots, transforms only.
 */
export function DotGrid({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // touch — skip

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const GAP = 30;
    const REPEL = 100;
    const EASE = 0.09;
    let dots: { x: number; y: number; ox: number; oy: number }[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    const mouse = { x: -9999, y: -9999 };

    const dotColor = () =>
      document.documentElement.classList.contains("dark")
        ? "rgba(255,255,255,0.16)"
        : "rgba(0,0,0,0.13)";

    const build = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = GAP; y < height - GAP / 2; y += GAP) {
        for (let x = GAP; x < width - GAP / 2; x += GAP) {
          dots.push({ x, y, ox: x, oy: y });
        }
      }
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = dotColor();
      for (const dot of dots) {
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL && dist > 0.01) {
          const force = ((REPEL - dist) / REPEL) * 18;
          dot.x += (dx / dist) * force * 0.25;
          dot.y += (dy / dist) * force * 0.25;
        }
        dot.x += (dot.ox - dot.x) * EASE;
        dot.y += (dot.oy - dot.y) * EASE;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    build();
    const observer = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? start() : stop()
    );
    observer.observe(canvas);

    const parent = canvas.parentElement!;
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", build);

    return () => {
      stop();
      observer.disconnect();
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", build);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
    />
  );
}
