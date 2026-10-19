import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

type Day = { date: string; level: number; count: number | null };
type Contributions = {
  username: string;
  total: number | null;
  days: Day[];
  source: "graphql" | "scrape";
};

/* one-hour in-memory cache — contribution graphs don't move fast */
const cache = new Map<string, { at: number; data: Contributions }>();
const TTL = 60 * 60 * 1000;

const LEVEL_FROM_GRAPHQL: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

/** Exact data via GraphQL when GITHUB_TOKEN is set. */
async function viaGraphql(username: string): Promise<Contributions | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "shivos-portfolio",
    },
    body: JSON.stringify({
      query: `query($login:String!){ user(login:$login){ contributionsCollection{ contributionCalendar{
        totalContributions weeks{ contributionDays{ date contributionCount contributionLevel } } } } } }`,
      variables: { login: username },
    }),
  });
  if (!res.ok) return null;

  const json = (await res.json()) as {
    data?: {
      user?: {
        contributionsCollection?: {
          contributionCalendar?: {
            totalContributions: number;
            weeks: {
              contributionDays: {
                date: string;
                contributionCount: number;
                contributionLevel: string;
              }[];
            }[];
          };
        };
      };
    };
  };
  const calendar =
    json.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) return null;

  return {
    username,
    total: calendar.totalContributions,
    days: calendar.weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        level: LEVEL_FROM_GRAPHQL[day.contributionLevel] ?? 0,
        count: day.contributionCount,
      }))
    ),
    source: "graphql",
  };
}

/** No token: parse the public contributions page (levels only). */
async function viaScrape(username: string): Promise<Contributions | null> {
  const res = await fetch(
    `https://github.com/users/${encodeURIComponent(username)}/contributions`,
    { headers: { "User-Agent": "Mozilla/5.0 (shivos-portfolio)" } }
  );
  if (!res.ok) return null;
  const html = await res.text();

  const days: Day[] = [];
  const cellRe =
    /<td[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g;
  for (const match of html.match(cellRe) ?? []) {
    const date = /data-date="(\d{4}-\d{2}-\d{2})"/.exec(match)?.[1];
    const level = /data-level="(\d)"/.exec(match)?.[1];
    if (date && level !== undefined) {
      days.push({ date, level: Number(level), count: null });
    }
  }
  if (days.length === 0) return null;
  days.sort((a, b) => a.date.localeCompare(b.date));

  const total = /([\d,]+)\s+contributions?\s+in the last year/.exec(html)?.[1];
  return {
    username,
    total: total ? Number(total.replace(/,/g, "")) : null,
    days,
    source: "scrape",
  };
}

export async function GET(request: Request) {
  const username = new URL(request.url).searchParams.get("user") ?? "";

  // only serve accounts configured in settings — this isn't an open proxy
  const settings = await getSettings();
  const allowed = settings.github.accounts
    .map((account) => account.username.toLowerCase())
    .filter(Boolean);
  if (!allowed.includes(username.toLowerCase())) {
    return Response.json({ error: "Unknown account" }, { status: 404 });
  }

  const hit = cache.get(username.toLowerCase());
  if (hit && Date.now() - hit.at < TTL) {
    return Response.json({ contributions: hit.data, cached: true });
  }

  try {
    const data = (await viaGraphql(username)) ?? (await viaScrape(username));
    if (!data) {
      return Response.json(
        { error: "GitHub did not answer" },
        { status: 502 }
      );
    }
    cache.set(username.toLowerCase(), { at: Date.now(), data });
    return Response.json({ contributions: data });
  } catch {
    return Response.json({ error: "GitHub did not answer" }, { status: 502 });
  }
}
