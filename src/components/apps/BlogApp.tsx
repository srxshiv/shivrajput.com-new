"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Loader2, PenLine } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const EASE = [0.25, 1, 0.5, 1] as const;

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  imageUrl: string | null;
  body: string;
  createdAt: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Cover({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  if (broken) return null;
  return (
    // remote covers are arbitrary URLs from the admin panel, so plain <img>
    // avoids needing every host allow-listed in next.config
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setBroken(true)}
      draggable={false}
      className={className}
    />
  );
}

export function BlogApp() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => alive && setPosts(data.posts ?? []))
      .catch(() => alive && setPosts([]));
    return () => {
      alive = false;
    };
  }, []);

  const open = posts?.find((p) => p.slug === openSlug) ?? null;

  if (posts === null) {
    return (
      <div className="flex h-full items-center justify-center gap-2 p-10 text-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="font-mono text-[12px]">fetching posts…</span>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-10 text-center">
        <PenLine className="h-8 w-8 text-faint" strokeWidth={1.25} />
        <p className="text-lg font-medium tracking-tight text-foreground">
          No posts yet.
        </p>
        <p className="handwritten rotate-[-2deg] text-xl text-muted">
          drafts are brewing — check back soon ☕
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          /* ── reader ─────────────────────────────── */
          <motion.article
            key="reader"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="h-full overflow-y-auto"
          >
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-background/85 px-6 py-3 backdrop-blur">
              <button
                onClick={() => setOpenSlug(null)}
                className="flex items-center gap-1 text-[13px] font-medium text-muted transition-colors hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" /> all posts
              </button>
              <span className="ml-auto font-mono text-[11px] text-faint">
                {formatDate(open.createdAt)}
              </span>
            </div>

            <div className="mx-auto max-w-2xl px-6 py-8">
              {open.imageUrl && (
                <Cover
                  src={open.imageUrl}
                  alt={open.title}
                  className="mb-8 aspect-[16/8] w-full rounded-2xl border border-line object-cover"
                />
              )}
              <h1 className="text-3xl font-medium tracking-tighter text-foreground md:text-4xl">
                {open.title}
              </h1>
              {open.excerpt && (
                <p className="mt-3 text-[15px] font-light leading-relaxed text-muted">
                  {open.excerpt}
                </p>
              )}
              <div className="md-body prose prose-sm mt-8 max-w-none prose-headings:tracking-tight prose-headings:font-medium prose-img:rounded-xl prose-img:border prose-img:border-line">
                <Markdown remarkPlugins={[remarkGfm]}>{open.body}</Markdown>
              </div>
              <p className="handwritten mt-12 rotate-[-2deg] text-lg text-faint">
                thanks for reading all the way down here
              </p>
            </div>
          </motion.article>
        ) : (
          /* ── index ──────────────────────────────── */
          <motion.div
            key="index"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="h-full overflow-y-auto p-6"
          >
            <p className="handwritten rotate-[-2deg] text-lg text-faint">
              things i wrote when i should have been sleeping ↓
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {posts.map((post, i) => (
                <motion.button
                  key={post.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}
                  whileHover={{ x: 4 }}
                  onClick={() => setOpenSlug(post.slug)}
                  className="group flex items-center gap-5 rounded-2xl border border-line bg-surface p-4 text-left transition-colors duration-300 hover:border-foreground/20"
                >
                  {post.imageUrl ? (
                    <Cover
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-20 w-28 shrink-0 rounded-xl border border-line object-cover"
                    />
                  ) : (
                    <span className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl border border-line bg-background">
                      <PenLine className="h-5 w-5 text-faint" strokeWidth={1.25} />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-[17px] font-medium tracking-tight text-foreground">
                        {post.title}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-faint">
                        {formatDate(post.createdAt)}
                      </span>
                    </span>
                    <span className="mt-1.5 line-clamp-2 block text-[13px] font-light leading-relaxed text-muted">
                      {post.excerpt ||
                        post.body.replace(/[#*`>\-[\]()]/g, "").slice(0, 160)}
                    </span>
                    <span className="mt-2 block font-mono text-[11px] text-faint transition-colors group-hover:text-accent">
                      read →
                    </span>
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
