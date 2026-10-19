"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { GithubIcon } from "../BrandIcons";
import { track } from "@/lib/track";
import type { GithubAccount } from "@/lib/settings-shared";

const EASE = [0.25, 1, 0.5, 1] as const;

type Day = { date: string; level: number; count: number | null };
type Contributions = {
  username: string;
  total: number | null;
  days: Day[];
};

/* level 0..4 → shipping intensity */
const LEVEL_CLASSES = [
  "bg-zinc-200/70 dark:bg-zinc-800/80",
  "bg-emerald-200 dark:bg-emerald-950",
  "bg-emerald-400 dark:bg-emerald-800",
  "bg-emerald-500 dark:bg-emerald-600",
  "bg-emerald-600 dark:bg-emerald-400",
];

function Heatmap({ days }: { days: Day[] }) {
  // last ~26 weeks fit a rail-width card; the API returns a full year
  const recent = days.slice(-26 * 7);
  const weeks: Day[][] = [];
  for (let i = 0; i < recent.length; i += 7) {
    weeks.push(recent.slice(i, i + 7));
  }

  return (
    <div className="flex gap-[3px]" aria-label="Contribution heatmap, last six months">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((day) => (
            <div
              key={day.date}
              title={
                day.count !== null
                  ? `${day.count} contribution${day.count === 1 ? "" : "s"} · ${day.date}`
                  : `${day.date} · shipping level ${day.level}/4`
              }
              className={`h-[9px] w-[9px] rounded-[2px] ${LEVEL_CLASSES[day.level] ?? LEVEL_CLASSES[0]}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function streak(days: Day[]) {
  let current = 0;
  for (let i = days.length - 1; i >= 0; i -= 1) {
    if (days[i].level > 0) current += 1;
    else if (i < days.length - 1) break; // today can be 0 without breaking it
  }
  return current;
}

function AccountCard({
  account,
  index,
}: {
  account: GithubAccount;
  index: number;
}) {
  const [data, setData] = useState<Contributions | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`/api/github?user=${encodeURIComponent(account.username)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json) => alive && setData(json.contributions))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [account.username]);

  const activeDays = data
    ? data.days.filter((day) => day.level > 0).length
    : null;

  return (
    <motion.a
      href={`https://github.com/${account.username}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("github_profile_click", { account: account.label })}
      initial={{ opacity: 0, y: 20, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -0.6 : 0.6 }}
      whileHover={{ rotate: 0, y: -4, scale: 1.005 }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.12 }}
      className="group block rounded-2xl border border-line bg-surface p-5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition-colors duration-300 hover:border-foreground/20 dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)]"
    >
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://github.com/${account.username}.png?size=80`}
          alt=""
          className="h-10 w-10 rounded-full border border-line"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-[15px] font-medium tracking-tight text-foreground">
            @{account.username}
            <span className="rounded-full border border-line bg-background px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-faint">
              {account.label}
            </span>
          </p>
          <p className="truncate font-mono text-[11px] text-faint">
            github.com/{account.username}
          </p>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>

      <div className="mt-4 min-h-[75px]">
        {failed ? (
          <p className="py-4 font-mono text-[12px] text-faint">
            github is sulking — tap through to see the real thing →
          </p>
        ) : !data ? (
          <div className="flex items-center gap-2 py-4 text-faint">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="font-mono text-[11px]">counting green squares…</span>
          </div>
        ) : (
          <>
            <Heatmap days={data.days} />
            <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1 font-mono text-[11px] text-muted">
              {data.total !== null && (
                <span>
                  <span className="font-semibold text-foreground">
                    {data.total.toLocaleString()}
                  </span>{" "}
                  contributions · last year
                </span>
              )}
              {activeDays !== null && (
                <span>
                  <span className="font-semibold text-foreground">
                    {activeDays}
                  </span>{" "}
                  active days
                </span>
              )}
              {streak(data.days) > 1 && (
                <span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {streak(data.days)}
                  </span>{" "}
                  day streak
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {account.note && (
        <p className="handwritten mt-3 rotate-[-1.5deg] text-base text-faint">
          {account.note}
        </p>
      )}
    </motion.a>
  );
}

export function GithubApp() {
  const [accounts, setAccounts] = useState<GithubAccount[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/settings")
      .then((r) => r.json())
      .then(
        (json) =>
          alive &&
          setAccounts(
            (json.settings?.github?.accounts ?? []).filter(
              (a: GithubAccount) => a.username
            )
          )
      )
      .catch(() => alive && setAccounts([]));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GithubIcon className="h-5 w-5 text-foreground" />
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            Proof of shipping
          </h2>
        </div>
        <span className="hidden items-center gap-1.5 font-mono text-[10px] text-faint sm:flex">
          less
          {LEVEL_CLASSES.map((cls, i) => (
            <span key={i} className={`h-[9px] w-[9px] rounded-[2px] ${cls}`} />
          ))}
          more
        </span>
      </div>

      <p className="handwritten rotate-[-1.5deg] text-lg text-muted">
        two accounts, one keyboard — the green just moved desks
      </p>

      {accounts === null ? (
        <div className="flex items-center gap-2 py-10 text-faint">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="font-mono text-[12px]">finding accounts…</span>
        </div>
      ) : accounts.length === 0 ? (
        <p className="py-10 text-center font-mono text-[12px] text-faint">
          no github accounts configured — add them in /admin → site
        </p>
      ) : (
        accounts.map((account, i) => (
          <AccountCard key={account.username} account={account} index={i} />
        ))
      )}
    </div>
  );
}
