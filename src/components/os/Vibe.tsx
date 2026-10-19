"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Vibe mode — the site becomes a rainy lo-fi study room. A lightweight canvas
 * rain layer plus rain sound synthesized live with the Web Audio API (filtered
 * noise — no audio files, nothing to download). Both fade in and out softly.
 */

function RainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    type Drop = { x: number; y: number; len: number; speed: number; alpha: number };
    let drops: Drop[] = [];

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drops = Array.from({ length: 110 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        len: 9 + Math.random() * 14,
        speed: 7 + Math.random() * 8,
        alpha: 0.12 + Math.random() * 0.25,
      }));
    };

    const isDark = () => document.documentElement.classList.contains("dark");

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      const hue = isDark() ? "210, 60%, 75%" : "215, 45%, 45%";
      for (const drop of drops) {
        ctx.strokeStyle = `hsla(${hue}, ${drop.alpha})`;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 1.5, drop.y + drop.len);
        ctx.stroke();
        drop.y += drop.speed;
        drop.x -= 0.4;
        if (drop.y > height + 20) {
          drop.y = -drop.len;
          drop.x = Math.random() * width;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    build();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", build);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0" />;
}

/** Rain sound from thin air: looped noise buffer → lowpass → gentle gain. */
function useRainSound(active: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!active) {
      // fade out and suspend
      const ctx = ctxRef.current;
      const gain = gainRef.current;
      if (ctx && gain) {
        gain.gain.cancelScheduledValues(ctx.currentTime);
        gain.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
        const id = setTimeout(() => ctx.suspend().catch(() => {}), 1500);
        return () => clearTimeout(id);
      }
      return;
    }

    // build once, resume on re-activate (this runs from a click — autoplay-safe)
    let ctx = ctxRef.current;
    if (!ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      ctxRef.current = ctx;

      // 2s of pink-ish noise, looped — reads as steady rain after filtering
      const seconds = 2;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0;
      for (let i = 0; i < data.length; i += 1) {
        const white = Math.random() * 2 - 1;
        b0 = 0.98 * b0 + 0.02 * white; // cheap pinking
        data[i] = (b0 * 3 + white * 0.25) * 0.6;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 900;
      lowpass.Q.value = 0.6;

      const gain = ctx.createGain();
      gain.gain.value = 0;
      gainRef.current = gain;

      source.connect(lowpass).connect(gain).connect(ctx.destination);
      source.start();
    }

    ctx.resume().catch(() => {});
    const gain = gainRef.current;
    if (gain) {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setTargetAtTime(0.16, ctx.currentTime, 0.8);
    }
  }, [active]);

  // teardown on unmount
  useEffect(
    () => () => {
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    },
    []
  );
}

export function VibeLayer({ active }: { active: boolean }) {
  useRainSound(active);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[58]"
        >
          {/* the dim — everything under it softens */}
          <div className="absolute inset-0 bg-black/25 dark:bg-black/35" />
          <RainCanvas />
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="handwritten absolute bottom-28 left-1/2 -translate-x-1/2 rotate-[-2deg] text-xl text-white/70"
          >
            rain's synthesized live. no mp3 was harmed ♡
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
