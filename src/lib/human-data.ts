/**
 * Content for the human side of ShivOS. Deliberately a plain file, not the
 * database — this is Shiv's story in Shiv's voice; edit it like a diary.
 */

export const story = {
  kicker: "the other partition",
  heroLines: ["hello,", "human."],
  sub: "you found the side without KPIs. welcome.",
  paragraphs: [
    "I'm Shiv. On the other side of that toggle I talk about row locks and compute bills — over here I'm just a guy from the Dehradun hills who moved to Jaipur for college and accidentally made building things his whole personality.",
    "I like systems, but I love the people they're for. I like quiet mornings, loud keyboards, chai over coffee some days and the exact opposite the next, and the specific joy of a friend saying 'wait, YOU made this?'",
    "This side of the site is slower on purpose. Drag the polaroids. Read the timeline. Poke the skill tree. Nothing here converts, tracks, or optimises. It just is.",
  ],
};

export type LifeEvent = {
  year: string;
  title: string;
  body: string;
  kind: "win" | "fail" | "start";
};

/* the anti-resume — wins AND faceplants, in one honest line */
export const lifeline: LifeEvent[] = [
  {
    year: "2004",
    title: "spawned in Dehradun",
    body: "hill town kid. foothills of the Himalayas, fog, and far too much curiosity about how the TV remote worked (it did not survive).",
    kind: "start",
  },
  {
    year: "2022",
    title: "ISC done — 93.5%",
    body: "Ann Mary School, Dehradun. the certificate says 93.5%. the memory says canteen.",
    kind: "win",
  },
  {
    year: "2022",
    title: "moved to Jaipur for B.Tech CS",
    body: "Manipal University Jaipur. first time living away from the hills. the flat land felt wrong for a month.",
    kind: "start",
  },
  {
    year: "2022",
    title: "first real code shipped… too early",
    body: "built a clinic management system for an actual hospital in first year — before my first algorithms exam. learned REST by breaking it in production.",
    kind: "fail",
  },
  {
    year: "2024",
    title: "Uniwizz — first users who weren't friends",
    body: "a campus marketplace. strangers signed up. strangers complained. strangers came back. addictive.",
    kind: "win",
  },
  {
    year: "2025",
    title: "the year of weird stacks",
    body: "voice AI (Heyllo), a Rust desktop app (Wispr Flow). half of it worked beautifully. the other half taught me Rust's borrow checker has no mercy.",
    kind: "fail",
  },
  {
    year: "2026",
    title: "DevsOwl hits 50 users on day one",
    body: "launched to a niche dev community and watched the counter go up in real time. did not sleep. worth it.",
    kind: "win",
  },
  {
    year: "2026",
    title: "full-stack engineer at MedikZo",
    body: "found it on LinkedIn, applied off-campus, got it. healthcare software used in tier-3 cities — the kind of towns big tech forgets. the most meaningful thing I've built. also how I ended up in Cooch Behar, West Bengal.",
    kind: "win",
  },
  {
    year: "2026",
    title: "back home in Dehradun",
    body: "the job went remote, so I followed the fog back up the hills. same work, better view.",
    kind: "win",
  },
  {
    year: "now",
    title: "graduating May 2026",
    body: "finishing the degree while shipping full time. sleep schedule: experimental.",
    kind: "start",
  },
];

export type HobbyNode = {
  id: string;
  label: string;
  level: number;
  note: string;
  x: number; // 0–100 within the tree canvas
  y: number;
};

/* the RPG skill tree — levels are vibes, not metrics */
export const hobbyTree: {
  center: HobbyNode;
  nodes: HobbyNode[];
} = {
  center: {
    id: "curiosity",
    label: "curiosity",
    level: 99,
    note: "the root stat. everything else branches from here.",
    x: 50,
    y: 50,
  },
  nodes: [
    {
      id: "side-projects",
      label: "side projects",
      level: 42,
      note: "five shipped. the graveyard of unfinished ones is classified.",
      x: 18,
      y: 22,
    },
    {
      id: "chai",
      label: "chai brewing",
      level: 31,
      note: "the compute bill is not the only thing I optimise.",
      x: 80,
      y: 18,
    },
    {
      id: "lofi",
      label: "lo-fi curation",
      level: 27,
      note: "the vibe button in the menu bar is a self-portrait.",
      x: 86,
      y: 58,
    },
    {
      id: "framework-tourism",
      label: "framework tourism",
      level: 35,
      note: "visits every new framework. sends postcards. rarely settles.",
      x: 14,
      y: 62,
    },
    {
      id: "ui-polish",
      label: "pixel nudging",
      level: 38,
      note: "will move a div 2px and call it a day well spent.",
      x: 33,
      y: 86,
    },
    {
      id: "night-owl",
      label: "night owl ops",
      level: 44,
      note: "peak commit hours: legally questionable.",
      x: 68,
      y: 88,
    },
  ],
};

export const education = [
  {
    period: "2022 — 2026",
    place: "Manipal University Jaipur",
    detail: "B.Tech, Computer Science · CGPA 7.7/10",
    aside: "the degree is in progress. the shipping didn't wait.",
  },
  {
    period: "2011 — 2022",
    place: "Ann Mary School, Dehradun",
    detail: "ISC · 93.5%",
    aside: "where the curiosity stat got its first points.",
  },
];
