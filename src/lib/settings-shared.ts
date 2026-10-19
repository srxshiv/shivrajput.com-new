/** Client-safe settings types + defaults (no Prisma import here). */

export type GithubAccount = {
  username: string;
  label: string;
  note: string;
};

export type SiteSettings = {
  /** dock app id → visible? (missing = visible) */
  dock: Record<string, boolean>;
  github: { accounts: GithubAccount[] };
  /** the status chip in the profile rail */
  status: string;
  /** the "current obsession" card on the human side's story app */
  obsession: { title: string; note: string };
};

export const DEFAULT_SETTINGS: SiteSettings = {
  dock: {
    work: true,
    experience: true,
    letter: true,
    skills: true,
    terminal: true,
    contact: true,
    notes: true,
    blog: true,
    videos: true,
    /* the life partition */
    story: true,
    memories: true,
    lifeline: true,
    hobbies: true,
  },
  github: {
    accounts: [
      {
        username: "srxshiv",
        label: "personal",
        note: "quiet lately — the green moved to work",
      },
      {
        username: "",
        label: "work",
        note: "where the office hours go",
      },
    ],
  },
  status: "Currently building at MedikZo",
  obsession: {
    title: "perfecting this website",
    note: "rotates monthly. currently: making an OS out of a portfolio.",
  },
};
