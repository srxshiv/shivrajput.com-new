"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clapperboard, Loader2, Play } from "lucide-react";
import { track } from "@/lib/track";

const EASE = [0.25, 1, 0.5, 1] as const;

type Video = {
  id: string;
  title: string;
  url: string;
  note: string | null;
  publishedAt: string | null;
};

function youtubeId(url: string) {
  const match =
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/.exec(
      url
    );
  return match?.[1] ?? null;
}

export function VideosApp() {
  const [videos, setVideos] = useState<Video[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/videos")
      .then((r) => r.json())
      .then((json) => alive && setVideos(json.videos ?? []))
      .catch(() => alive && setVideos([]));
    return () => {
      alive = false;
    };
  }, []);

  if (videos === null) {
    return (
      <div className="flex h-full items-center justify-center gap-2 p-10 text-faint">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="font-mono text-[12px]">rolling tape…</span>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-10 text-center">
        <Clapperboard className="h-8 w-8 text-faint" strokeWidth={1.25} />
        <p className="text-lg font-medium tracking-tight text-foreground">
          Nothing filmed yet.
        </p>
        <p className="handwritten max-w-xs rotate-[-2deg] text-xl leading-snug text-muted">
          camera shy for now — the terminal does all my talking
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <p className="handwritten rotate-[-1.5deg] text-lg text-faint">
        me, on camera, explaining things ↓
      </p>
      {videos.map((video, i) => {
        const id = youtubeId(video.url);
        return (
          <motion.a
            key={video.id}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("video_click", { title: video.title })}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3, scale: 1.01 }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
            className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition-colors duration-300 hover:border-foreground/20"
          >
            <span className="relative block h-20 w-32 shrink-0 overflow-hidden rounded-xl border border-line bg-background">
              {id ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <span className="flex h-full items-center justify-center">
                  <Clapperboard className="h-5 w-5 text-faint" strokeWidth={1.25} />
                </span>
              )}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Play className="ml-0.5 h-3.5 w-3.5" fill="currentColor" />
                </span>
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-medium tracking-tight text-foreground">
                {video.title}
              </span>
              {video.note && (
                <span className="mt-1 line-clamp-2 block text-[12.5px] font-light leading-relaxed text-muted">
                  {video.note}
                </span>
              )}
              {video.publishedAt && (
                <span className="mt-1.5 block font-mono text-[10.5px] text-faint">
                  {new Date(video.publishedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </span>
          </motion.a>
        );
      })}
    </div>
  );
}
