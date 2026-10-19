"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import {
  DEFAULT_SETTINGS,
  type SiteSettings,
} from "@/lib/settings-shared";

/* dock apps, split by which side of the OS they live on. `notes` shows on
   both sides, so it rides along with the work group. */
const APP_GROUPS: { side: string; note: string; apps: [string, string][] }[] = [
  {
    side: "Work side",
    note: "the work partition — everyone lands here.",
    apps: [
      ["work", "Work / case files"],
      ["experience", "Experience"],
      ["letter", "Cover letter"],
      ["skills", "skills.json"],
      ["terminal", "Terminal"],
      ["contact", "Contact"],
      ["notes", "Visitor notes"],
      ["blog", "Blog"],
      ["videos", "Videos"],
    ],
  },
  {
    side: "Life side",
    note: "the human partition behind the toggle.",
    apps: [
      ["story", "Story"],
      ["memories", "Memories"],
      ["lifeline", "Timeline"],
      ["hobbies", "Skill tree"],
    ],
  },
];

const inputCls =
  "rounded-xl border border-line bg-background px-3.5 py-2 text-[13px] text-foreground outline-none focus:border-foreground/25";

export function SiteTab() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => setSettings(data.settings ?? DEFAULT_SETTINGS))
      .catch(() => setSettings(DEFAULT_SETTINGS));
  }, []);

  const save = async () => {
    if (!settings) return;
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings }),
    });
    setBusy(false);
    setMessage(res.ok ? "Saved — the site picks it up on next load." : "Could not save.");
  };

  if (!settings) {
    return <Loader2 className="mx-auto mt-10 h-4 w-4 animate-spin text-muted" />;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* dock visibility */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="text-[15px] font-medium tracking-tight text-foreground">
          Dock apps
        </h3>
        <p className="mt-1 text-[12.5px] font-light text-muted">
          Untick to hide an app from the dock (desktop and mobile). Each side
          keeps at least one app on — it&apos;s an OS, not a screensaver.
        </p>
        {APP_GROUPS.map((group) => {
          /* the last app standing on a side can't be switched off */
          const liveCount = group.apps.filter(
            ([id]) => settings.dock[id] !== false
          ).length;
          return (
            <div key={group.side} className="mt-4">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-faint">
                {group.side} — {group.note}
              </p>
              <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {group.apps.map(([id, label]) => {
                  const on = settings.dock[id] !== false;
                  return (
                    <label
                      key={id}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-[13px] transition-colors ${
                        on
                          ? "border-line bg-background text-foreground"
                          : "border-line/60 bg-surface text-faint"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        disabled={on && liveCount <= 1}
                        onChange={(e) =>
                          setSettings((s) =>
                            s
                              ? {
                                  ...s,
                                  dock: { ...s.dock, [id]: e.target.checked },
                                }
                              : s
                          )
                        }
                      />
                      {label}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* github accounts */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="text-[15px] font-medium tracking-tight text-foreground">
          GitHub accounts
        </h3>
        <p className="mt-1 text-[12.5px] font-light text-muted">
          Both show up in the GitHub app with their contribution graphs. Leave a
          username empty to hide that card. The note is the handwritten aside.
        </p>
        {settings.github.accounts.map((account, i) => (
          <div key={i} className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_120px_1.4fr]">
            <input
              value={account.username}
              onChange={(e) =>
                setSettings((s) => {
                  if (!s) return s;
                  const accounts = [...s.github.accounts];
                  accounts[i] = { ...accounts[i], username: e.target.value.trim() };
                  return { ...s, github: { accounts } };
                })
              }
              placeholder="username"
              className={`${inputCls} font-mono`}
            />
            <input
              value={account.label}
              onChange={(e) =>
                setSettings((s) => {
                  if (!s) return s;
                  const accounts = [...s.github.accounts];
                  accounts[i] = { ...accounts[i], label: e.target.value };
                  return { ...s, github: { accounts } };
                })
              }
              placeholder="label"
              className={inputCls}
            />
            <input
              value={account.note}
              onChange={(e) =>
                setSettings((s) => {
                  if (!s) return s;
                  const accounts = [...s.github.accounts];
                  accounts[i] = { ...accounts[i], note: e.target.value };
                  return { ...s, github: { accounts } };
                })
              }
              placeholder="handwritten note"
              className={inputCls}
            />
          </div>
        ))}
      </div>

      {/* status line */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="text-[15px] font-medium tracking-tight text-foreground">
          Status chip
        </h3>
        <p className="mt-1 text-[12.5px] font-light text-muted">
          The green-dot line at the top of the profile rail.
        </p>
        <input
          value={settings.status}
          onChange={(e) =>
            setSettings((s) => (s ? { ...s, status: e.target.value } : s))
          }
          className={`${inputCls} mt-3 w-full`}
        />
      </div>

      {/* current obsession — the human side's story card */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="text-[15px] font-medium tracking-tight text-foreground">
          Current obsession
        </h3>
        <p className="mt-1 text-[12.5px] font-light text-muted">
          The card on the human side&apos;s story app. Rotate it whenever the
          obsession rotates.
        </p>
        <input
          value={settings.obsession?.title ?? ""}
          onChange={(e) =>
            setSettings((s) =>
              s
                ? {
                    ...s,
                    obsession: {
                      note: s.obsession?.note ?? "",
                      title: e.target.value,
                    },
                  }
                : s
            )
          }
          placeholder="what it is"
          className={`${inputCls} mt-3 w-full`}
        />
        <input
          value={settings.obsession?.note ?? ""}
          onChange={(e) =>
            setSettings((s) =>
              s
                ? {
                    ...s,
                    obsession: {
                      title: s.obsession?.title ?? "",
                      note: e.target.value,
                    },
                  }
                : s
            )
          }
          placeholder="a line of context"
          className={`${inputCls} mt-2 w-full`}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={busy}
          className="flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-[13px] font-semibold text-background disabled:opacity-40"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save site settings
        </button>
        {message && <span className="font-mono text-[11px] text-muted">{message}</span>}
      </div>
    </div>
  );
}
