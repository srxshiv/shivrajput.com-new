"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Save, Trash2, ArrowUp, ArrowDown } from "lucide-react";

type StoryItem = { kind: string; title: string; body: string };

type Project = {
  id: string;
  slug: string;
  title: string;
  year: string;
  summary: string;
  detail: string;
  image: string | null;
  live: string | null;
  github: string | null;
  stack: string[];
  story: StoryItem[];
  level: string;
  order: number;
  published: boolean;
};

const STORY_KINDS = ["decision", "feature", "metric", "challenge", "quirk"];
const LEVELS = ["advanced", "intermediate", "beginner"];

type Draft = {
  id: string;
  slug: string;
  title: string;
  year: string;
  summary: string;
  detail: string;
  image: string;
  live: string;
  github: string;
  stack: string[];
  story: StoryItem[];
  level: string;
  order: number;
  published: boolean;
};

const EMPTY: Draft = {
  id: "",
  slug: "",
  title: "",
  year: "",
  summary: "",
  detail: "",
  image: "",
  live: "",
  github: "",
  stack: [],
  story: [],
  level: "intermediate",
  order: 0,
  published: true,
};

const inputCls =
  "rounded-xl border border-line bg-background px-3.5 py-2 text-[13px] text-foreground outline-none focus:border-foreground/25";

export function ProjectsTab() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [draft, setDraft] = useState<Draft & { stackText: string }>({
    ...EMPTY,
    stackText: "",
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/projects");
    const data = await res.json();
    setProjects(data.projects ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const edit = (project: Project) =>
    setDraft({
      ...project,
      level: project.level ?? "intermediate",
      image: project.image ?? "",
      live: project.live ?? "",
      github: project.github ?? "",
      stackText: (project.stack ?? []).join(", "),
    });

  const save = async () => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...draft,
        stack: draft.stackText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMessage(data.error ?? "Could not save.");
      return;
    }
    setMessage(draft.id ? "Updated." : "Created.");
    setDraft({ ...EMPTY, stackText: "" });
    load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
    load();
  };

  const setStory = (story: StoryItem[]) => setDraft((d) => ({ ...d, story }));

  const moveStory = (i: number, dir: -1 | 1) => {
    const story = [...draft.story];
    const j = i + dir;
    if (j < 0 || j >= story.length) return;
    [story[i], story[j]] = [story[j], story[i]];
    setStory(story);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="text-[15px] font-medium tracking-tight text-foreground">
          {draft.id ? `Edit: ${draft.title}` : "New project"}
        </h3>
        <p className="mt-1 text-[12.5px] font-light text-muted">
          The story items become the case-file timeline — decisions, features,
          metrics, challenges, and the occasional aside.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} placeholder="Title" className={inputCls} />
          <div className="grid grid-cols-3 gap-3">
            <input value={draft.year} onChange={(e) => setDraft((d) => ({ ...d, year: e.target.value }))} placeholder="Year" className={inputCls} />
            <input type="number" value={draft.order} onChange={(e) => setDraft((d) => ({ ...d, order: Number(e.target.value) || 0 }))} placeholder="Order" className={inputCls} />
            <select
              value={draft.level}
              onChange={(e) => setDraft((d) => ({ ...d, level: e.target.value }))}
              aria-label="Difficulty tier"
              className={inputCls}
            >
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          <input value={draft.summary} onChange={(e) => setDraft((d) => ({ ...d, summary: e.target.value }))} placeholder="One-line summary" className={`${inputCls} sm:col-span-2`} />
          <textarea value={draft.detail} onChange={(e) => setDraft((d) => ({ ...d, detail: e.target.value }))} placeholder="Detail paragraph" rows={3} className={`${inputCls} resize-y sm:col-span-2`} />
          <input value={draft.image} onChange={(e) => setDraft((d) => ({ ...d, image: e.target.value }))} placeholder="Screenshot URL" className={`${inputCls} sm:col-span-2`} />
          <input value={draft.live} onChange={(e) => setDraft((d) => ({ ...d, live: e.target.value }))} placeholder="Live URL (optional)" className={inputCls} />
          <input value={draft.github} onChange={(e) => setDraft((d) => ({ ...d, github: e.target.value }))} placeholder="GitHub URL (optional)" className={inputCls} />
          <input value={draft.stackText} onChange={(e) => setDraft((d) => ({ ...d, stackText: e.target.value }))} placeholder="Stack — comma separated" className={`${inputCls} sm:col-span-2 font-mono`} />
        </div>

        {/* story editor */}
        <div className="mt-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
              story timeline · {draft.story.length} items
            </p>
            <button
              onClick={() =>
                setStory([
                  ...draft.story,
                  { kind: "decision", title: "", body: "" },
                ])
              }
              className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-[12px] text-muted transition-colors hover:text-foreground"
            >
              <Plus className="h-3 w-3" /> add item
            </button>
          </div>

          {draft.story.map((item, i) => (
            <div key={i} className="rounded-xl border border-line bg-background p-3">
              <div className="flex items-center gap-2">
                <select
                  value={item.kind}
                  onChange={(e) =>
                    setStory(
                      draft.story.map((s, j) =>
                        j === i ? { ...s, kind: e.target.value } : s
                      )
                    )
                  }
                  className="rounded-lg border border-line bg-surface px-2 py-1.5 font-mono text-[11px] text-muted outline-none"
                >
                  {STORY_KINDS.map((kind) => (
                    <option key={kind} value={kind}>
                      {kind}
                    </option>
                  ))}
                </select>
                <input
                  value={item.title}
                  onChange={(e) =>
                    setStory(
                      draft.story.map((s, j) =>
                        j === i ? { ...s, title: e.target.value } : s
                      )
                    )
                  }
                  placeholder="Item title"
                  className={`${inputCls} min-w-0 flex-1 py-1.5`}
                />
                <button onClick={() => moveStory(i, -1)} aria-label="Move up" className="rounded-full border border-line p-1.5 text-faint hover:text-foreground">
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button onClick={() => moveStory(i, 1)} aria-label="Move down" className="rounded-full border border-line p-1.5 text-faint hover:text-foreground">
                  <ArrowDown className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setStory(draft.story.filter((_, j) => j !== i))}
                  aria-label="Remove item"
                  className="rounded-full border border-line p-1.5 text-faint transition-colors hover:border-red-400/50 hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <textarea
                value={item.body}
                onChange={(e) =>
                  setStory(
                    draft.story.map((s, j) =>
                      j === i ? { ...s, body: e.target.value } : s
                    )
                  )
                }
                placeholder="What happened / why you decided it / how you built it"
                rows={2}
                className={`${inputCls} mt-2 w-full resize-y`}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-[13px] text-muted">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) =>
                setDraft((d) => ({ ...d, published: e.target.checked }))
              }
            />
            published
          </label>
          <button
            onClick={save}
            disabled={busy || !draft.title}
            className="flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-[13px] font-semibold text-background disabled:opacity-40"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {draft.id ? "Update project" : "Create project"}
          </button>
          {draft.id && (
            <button
              onClick={() => setDraft({ ...EMPTY, stackText: "" })}
              className="text-[12px] text-muted underline underline-offset-4"
            >
              cancel edit
            </button>
          )}
          {message && (
            <span className="font-mono text-[11px] text-muted">{message}</span>
          )}
        </div>
      </div>

      {projects === null ? (
        <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted" />
      ) : (
        <div className="flex flex-col gap-2">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium text-foreground">
                  {project.title}{" "}
                  <span className="font-mono text-[11px] text-faint">
                    · {project.year} · {project.level ?? "intermediate"} ·{" "}
                    {project.story.length} story items
                    {project.published ? "" : " · draft"}
                  </span>
                </span>
              </span>
              <button onClick={() => edit(project)} className="rounded-full border border-line px-3 py-1 text-[12px] text-muted transition-colors hover:text-foreground">
                Edit
              </button>
              <button onClick={() => remove(project.id)} aria-label={`Delete ${project.title}`} className="rounded-full border border-line p-1.5 text-faint transition-colors hover:border-red-400/50 hover:text-red-500">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
